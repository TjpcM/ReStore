import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import agent from "../../api/agent";
import { getCookie } from "../../api/Util/util";
import { Basket } from "../../models/basket";

interface BasketState {
    basket: Basket | null;
    status: string;
}

//one properties of state will be basket when passed a initialSate, so state.basket
// action.payload will be anything we passe in
const initialState: BasketState = {
    basket: null,
    status: 'idle'
}

// Thunk is a function that return a function  - is a wrapper to make async call
// using redux toolkit, the argument: 1 - name,  
export const fetchBasketAsync = createAsyncThunk<Basket>(
    'basket/fetchBasketAsync',
    async (_,thukAPI) => {
      try {
        return await agent.Basket.get();
      } catch (error:any) {
        return thukAPI.rejectWithValue({error:error.data})
      }
    },
    {
      condition:() => {
        if (!getCookie('buyId')) return false;
      }
    }
  )

export const addBasketItemAsync = createAsyncThunk<Basket,{productId:number, quantity?:number}>(
    'basket/addBasketItemAsync',
    async ({ productId, quantity=1 }, thunkAPI) => {
     try {
           return await agent.Basket.addItem(productId, quantity);
     }catch (error:any) {
        return thunkAPI.rejectWithValue({error:error.data});
     }
    }
)

export const removeBasketItemAsync = createAsyncThunk<void,{productId:number, quantity:number, name?:string}>(
    'basket/removeBasketItemAsync',
    async ({productId, quantity}, thunkAPI) => {
        try {
              await agent.Basket.removeItem(productId, quantity);
        } catch (error:any) {
            return thunkAPI.rejectWithValue({error:error.data});
        }
    }
)

export const basketSlice = createSlice({
    name: 'basket',
    initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload
        },
        clearBasket:(state) => {
            state.basket = null;
        }
    },
    extraReducers:(builder =>{
        builder.addCase(addBasketItemAsync.pending, (state,action) =>{
            state.status='pendingAddItem' + action.meta.arg.productId;
        });
        builder.addCase(removeBasketItemAsync.pending, (state,action) => {
            state.status ='pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
        });

        builder.addCase(removeBasketItemAsync.fulfilled, (state,action) => {
            const { productId, quantity } = action.meta.arg;  //telling that we will need to pass 2 arguments
            const itemIndex = state.basket?.items.findIndex(i => i.productId === productId);

            if (itemIndex === -1 || itemIndex === undefined) return;

            state.basket!.items[itemIndex].quantity -= quantity;
            if (state.basket?.items[itemIndex].quantity === 0) state.basket.items.splice(itemIndex, 1); //remove item from the basket

            state.status= 'idle' 
         });
        builder.addCase(removeBasketItemAsync.rejected,(state,action) => {
            state.status= 'idle';
            console.log(action.payload);
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state,action) =>{
            state.basket= action.payload;
            state.status='idle';
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.rejected,fetchBasketAsync.rejected),(state,action)=>{
            console.log(action.payload);
            state.status='idle';
        });
        builder.addMatcher(isAnyOf(addBasketItemAsync.fulfilled,fetchBasketAsync.fulfilled) , (state,action) =>{
            state.basket=action.payload;
            state.status='idle';
        });
        builder.addMatcher(isAnyOf( addBasketItemAsync.rejected,fetchBasketAsync.rejected), (state,action) =>{
            state.status='idle';
            console.log(action.payload);
        });

    })
})

export const { setBasket, clearBasket} = basketSlice.actions;



