import { Grid } from "@mui/material";
import { Product } from "../../models/product";
import { useAppSelector } from "../../store/configureStore";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
    products: Product[];
}

export default function ProductList({products}:Props) {
    const {productsLoaded} =useAppSelector(state => state.catalog);
    return(
    //     <List>
    //     {products.map((product) =>(
    //         <ProductCard key={product.id} product={product}/>
    //     )
    //     )}
    //    </List>

        <Grid container spacing ={4}>
         {products.map((product) =>(
            <Grid item xs={4} key={product.id}>
             {!productsLoaded ?  <ProductCardSkeleton /> : <ProductCard  product={product}/>}
             
           </Grid>
          ))}
       </Grid>

)
}