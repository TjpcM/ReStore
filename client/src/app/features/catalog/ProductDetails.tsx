import { LoadingButton } from "@mui/lab";
import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NotFound from "../../errors/NotFound";
import LoadingComponent from "../../layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { addBasketItemAsync, removeBasketItemAsync } from "../Basket/basketSlice";
import { fetchProductAsync, productSelector } from "./catalogSlice";

//'useParms' return key/value pair of dynamic parameter
export default function ProductDetais(){

    const {basket,status} = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();

    const {id} = useParams<{id: any}>(); //useParams return parameter in the route
    //const [product,setProduct] = useState<Product|null>(null);
    const product =useAppSelector(state => productSelector.selectById(state,id));

    const {status:productStatus} = useAppSelector(state=> state.catalog); 
    const [quantity, setQuantity] = useState(0);

    const item = basket?.items.find(i => i.productId === product?.id);
    //let id1 = id ? id : '';

    useEffect(() =>{
        if (item) setQuantity(item.quantity);
        if(!product) dispatch(fetchProductAsync(parseInt(id)));
 
    },[id,item, dispatch, product]) // when 'id' or 'item' changes, and component mount, this will be called


    function handleInputChange(event:any){
        if (event.target.value >= 0){
            setQuantity(parseInt(event.target.value));
        }
    }
    
    function handleUpdateCart(){
        if (!item || quantity > item.quantity){
            const updatedQuantity = item ? quantity - item.quantity: quantity;
            dispatch(addBasketItemAsync({productId:product?.id!, quantity:updatedQuantity}))
        }else{
            const updatedQuantity = item.quantity -quantity;
            dispatch(removeBasketItemAsync({productId:product?.id!, quantity: updatedQuantity}));
        }
    }

    if (productStatus.includes('pending')) return <LoadingComponent  message ='Loading products...'/>

    if(!product) return <NotFound/>

    return(
        <Grid container spacing={6} >
            <Grid item xs={6}>
                <img src={product.pictureUrl} alt={product.name} style={{width:'100%'}}/>
            </Grid>
             <Grid item xs={6}>
                <Typography variant='h3'> {product.name}</Typography>
                <Divider sx={{mb:2}} />
                <Typography variant='h4' color='secondary'> £{(product.price/100).toFixed(2)}</Typography>
                <TableContainer>
                    <Table>
                        <TableBody>
                        <TableRow>
                            <TableCell>Name</TableCell>                            
                            <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Description</TableCell>                            
                            <TableCell>{product.description}</TableCell>
                            </TableRow>
    
                            <TableRow>
                            <TableCell>Type</TableCell>                            
                            <TableCell>{product.type}</TableCell>
                            </TableRow>
                            <TableRow>
                            <TableCell>Description</TableCell>                            
                            <TableCell>{product.description}</TableCell>
                            </TableRow>
                        </TableBody>
                      </Table>
                   </TableContainer>
                   <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                         onChange={handleInputChange} 
                          variant='outlined'
                          type='number'
                          fullWidth
                          value={quantity}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <LoadingButton
                        disabled={item?.quantity === quantity || !item && quantity===0}
                        loading={status.includes('pending')}
                        onClick={handleUpdateCart}
                        sx={{height:'55px'}}
                        color='primary'
                        size='large'
                        variant='contained'
                        fullWidth
                        >
                            {item ? 'Update Quantity' :'Add to Cart'}
                        </LoadingButton>

                      </Grid>

                   </Grid>
             </Grid>
        </Grid>
    )
}