import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import agent from "../../api/agent";
import { MetaData } from "../../models/pagination";
import { Product, ProductParams } from "../../models/product";
import { RootState } from "../../store/configureStore";

interface CatalogState {
    productsLoaded:boolean;
    filtersLoaded:Boolean;
    status:string;
    brands:string[];
    types:string[];
    productParams:ProductParams;
    metaData: MetaData|null;
}



// normalizing data, so each time we need data we dont have to go and fetch it again
//So entities/states is stored in slice, with "ids" so data is available :"createEntityAdapter<>()"" or 
// "normalizr"
const productsAdapter  = createEntityAdapter<Product>();

function getAxiosParams(productParams:ProductParams){
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy',productParams.orderBy);   
    if (productParams.searchTerm)params.append('searchTerm',productParams.searchTerm);   
    if(productParams.brands.length >0)params.append('brands',productParams.brands.toString()); 
    if(productParams.types.length > 0)params.append('types',productParams.types.toString());   
    return params;  
}

//thunkAPI  - to handle the error  & get the state

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state:RootState}>(
    'catalog/fetchProductsAsync',
    async (_, thunkAPI) => {
        //thunkAPI has a getState()
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
      try {
          const response = await agent.Catalog.list(params);
          thunkAPI.dispatch(setMetaData(response.metaData));
          return response.items;
      } catch (error) {
          return thunkAPI.rejectWithValue({error})
      }
    }
  );
//thunkAPI  - to handle the error  
export const fetchProductAsync = createAsyncThunk<Product,number>(
    'catalog/fetchProductAsync',
    async (productId, thunkAPI) => {
      try {
          return await agent.Catalog.details(productId);
      } catch (error) {
        //error got is of type 'any'
          return thunkAPI.rejectWithValue({error})       
      }
    }
  );
  
  export const fetchFiltersAsync = createAsyncThunk(
    'catalog/fetchFilters',
    async (_,thunkAPI) =>{
        try {
            return agent.Catalog.fetchFilters();            
        } catch (error) {
            return thunkAPI.rejectWithValue({error});
        }
    }
  );

  function initParams(){
    return {
        pageNumber:1,
        pageSize:6,
        orderBy:'name',
        brands:[],
        types:[]
    }
  }


export const catalogSlice = createSlice({
    name:'catalog',
    initialState: productsAdapter.getInitialState<CatalogState>({
        productsLoaded:false,
        filtersLoaded:false,
        status:'idle',
        brands:[],
        types:[],
        productParams:initParams(),
        metaData:null
    }),
    reducers:{//what are set here are actions
        setProductParams:(state,action) =>{
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload, pageNumber:1};
        },
        setPageNumber: (state, action) =>{
            state.productsLoaded= false;
            state.productParams = {...state.productParams, ...action.payload};
        },
        setMetaData:(state,action) => {
            state.metaData= action.payload;
        },
        resetProductParams: (state)=> {
            state.productParams = initParams();
        }
    },
    extraReducers:( 
        builder => {
        builder.addCase(fetchProductsAsync.pending, (state) =>{
            state.status = 'pendingFetchProducts';
        });
        builder.addCase(fetchProductsAsync.fulfilled, (state,action)=>{
            productsAdapter.setAll(state, action.payload);//2 arguments: state, entities
            state.status='idle';
            state.productsLoaded=true;
        });
        builder.addCase(fetchProductsAsync.rejected,(state,action)=>{
            console.log(action.payload);
            state.status='idle';
        });
        builder.addCase(fetchProductAsync.pending,(state) =>{
            state.status= 'pendingFetchPoroduct'
        });
        builder.addCase(fetchProductAsync.fulfilled, (state,action)=>{
            productsAdapter.upsertOne(state,action.payload);//upsetOne == update & insert => update if exists or insert if not
            state.status ='idle';
        });
        builder.addCase(fetchProductAsync.rejected,(state,action)=>{
            console.log(action.payload);
            state.status = 'idle';
        });
        builder.addCase(fetchFiltersAsync.pending,(state)=>{
            state.status= 'pendingFetchFilters';
        });
        builder.addCase(fetchFiltersAsync.fulfilled,(state,action)=>{
            state.brands= action.payload.brands;
            state.types = action.payload.types;
            state.status='idle';
            state.filtersLoaded=true;
        });
        builder.addCase(fetchFiltersAsync.rejected, (state,action)=>{
            state.status='idle';
            console.log(action.payload);
        })
    })
});

export const productSelector = productsAdapter.getSelectors((state:RootState) => state.catalog);

export const {setProductParams, resetProductParams, setMetaData, setPageNumber} = catalogSlice.actions;