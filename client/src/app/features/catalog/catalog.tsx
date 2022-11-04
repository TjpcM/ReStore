import { Grid, Paper } from "@mui/material";
import { useEffect } from "react";
import AppPagination from "../../components/AppPagination";
import CheckboxButtons from "../../components/CheckboxButtons";
import RadioButtonGroup from "../../components/RadioButtonGroup";
import LoadingComponent from "../../layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { fetchFiltersAsync, fetchProductsAsync, productSelector, setPageNumber, setProductParams } from "./catalogSlice";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const sortOptions =[
  {value:'name', label:'Aphabetical'},
  {value:'priceDesc', label:'Price - High to ow'},
  {value:'price', label:'Price - Low to high'},
]

// Instead of passing "props:any", interface were used specifying the type and method signature 
  //export default function Catalog(props:Props) {
export default function Catalog() {
 const products = useAppSelector(productSelector.selectAll);//
 const {productsLoaded,filtersLoaded, brands, types, productParams,metaData} = useAppSelector(state => state.catalog);
 const dispatch =  useAppDispatch();

 // const [loading, setLoading]= useState(true);

  useEffect(()=>{
    if (!productsLoaded) dispatch(fetchProductsAsync());
   },[productsLoaded,dispatch]);

useEffect(() =>{
  if (!filtersLoaded) dispatch(fetchFiltersAsync());

},[dispatch,filtersLoaded]);

if(!filtersLoaded) return <LoadingComponent message='Loading products...'/>;

        return (
      <Grid container columnSpacing={4}>
        <Grid item xs={3}>
          <Paper sx={{mb:2}}>
            <ProductSearch/>
          </Paper>
          <Paper sx={{mb:2, p:2}}>
            <RadioButtonGroup  
                  options={sortOptions} 
                  onChange={(e) => dispatch(setProductParams({orderBy: e.target.value}))}
                  selectedValue={productParams.orderBy}            />
          </Paper>
          <Paper sx={{mb:2, p:2}}>
            <CheckboxButtons 
               items={brands} 
               checked={productParams.brands}
               onChange={ (items: string[])  => dispatch(setProductParams({brands:items}))}        
            />
          </Paper>
          <Paper sx={{mb:2,p:2}}>
            <CheckboxButtons 
               items={types} 
               checked={productParams.types}
               onChange={ (items: string[])  => dispatch(setProductParams({types:items}))}        
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <ProductList products={products} />
        </Grid>
        <Grid item xs={3} />

        <Grid item xs={9} sx={{mb:2}}>
          {metaData &&
          <AppPagination
          metaData={metaData} 
          onPageCnage ={(page:number) => dispatch(setPageNumber({pageNumber:page}))}
          />}
        </Grid>
      </Grid>
    )
}

// interface Props {
//    products: Product[];
//    addProduct:() => void;
// }

//   function addProduct(){
//     setProducts(prevState =>[...prevState, 
//       {
//         id: prevState.length + 101,
//         name:"product" + (prevState.length +1), 
//         price:(prevState.length * 100) + 100,
//         brand: 'some brand',
//         description: 'some decription',
//         pictureUrl: 'http://picsum.photos/200',
      
//   }])
// }
