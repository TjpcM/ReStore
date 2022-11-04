import { Avatar, Button, Card, CardActions, CardContent, CardMedia, Typography, CardHeader } from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../../models/product";
import {LoadingButton} from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { addBasketItemAsync } from "../Basket/basketSlice";

interface Props {
    product: Product;
}



export default function ProductCard({product}:Props) {
const {status} = useAppSelector(state => state.basket);
//const {setBasket} = useStoreContext();
const dispatch = useAppDispatch();

return(
<Card >
  <CardHeader
     avatar={
      <Avatar sx={{bgcolor: 'secondary.main'}}>
        {product.name.charAt(0).toUpperCase()}
      </Avatar>
     }
     title={product.name}
     titleTypographyProps={{
       sx:{fontWeight:'bold', color: 'primary.main'}
     }}
  />
      <CardMedia
       // component="img"
        //alt="green iguana"
        //height="140"
        sx={{height:140, backgroundSize:'contain', bgcolor: 'primary.light'}}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography gutterBottom color='secondary' variant="h5" >
          £{(product.price/100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton loading={status.includes('pendingAddItem' + product.id)} 
           onClick ={() => dispatch(addBasketItemAsync({productId:product.id}))}
           size="small">Add to card</LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
)
}
// export default function ProductCard({product}:Props) {
//     return(


//         <ListItem key={product.id}>
//         <ListItemAvatar>
//           <Avatar src={product.pictureUrl}></Avatar>
//         </ListItemAvatar>
//         <ListItemText>
//           {product.name} - {product.price}
//         </ListItemText>
//      </ListItem>

// )
// }