import { Navigate } from "react-router-dom";
import CheckoutPage from "../features/checkout/CheckoutPage";
import { useAppSelector } from "../store/configureStore";

// A wrapper for <Route> that redirects to the login

// screen if you're not yet authenticated.
export default function PrivateRoute(props: any) {
  const {user} = useAppSelector(state => state.account);
  console.log(props.location);
    return(
     user ? <CheckoutPage />:(<Navigate  to ="/login" state={{from:props.location}} />      )    
     );
}

  /*         <Route
        {...rest}
        render({(props: any) =>
          user ? (
            <Component {...props}/>
          ) : (
              to="/login" 
                state= " from: props.location"
          
            />
          )
        })
      /> 
 */