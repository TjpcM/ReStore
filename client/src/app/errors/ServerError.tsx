import { Button, Divider, Paper, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import {  useNavigate } from "react-router-dom";
import { BrowserHistory } from "history";
import { BrowserRouterProps, useLocation } from "react-router-dom";

//interface Props extends BrowserRouterProps {
  //interface Props {
  //  history: BrowserHistory;
    
  //} 
  
 
  interface Props extends BrowserRouterProps {
    history: BrowserHistory;
    
  }
   
  

  
  export default function ServerError({history}:Props){
    
      const navigate = useNavigate();// useHistory replaced by useNavigation()
      const { state }:any = useLocation();
      

       

    return(
   
    <Container component={Paper}>
        
        {state?.error? (
                <>
                    <Typography variant='h3' color='error' gutterBottom>{state.error.title}</Typography>
                    <Divider />
                    <Typography>{state.error.detail || 'Internal server error'}</Typography>
                </>
            ) : (
                <Typography variant='h5' color='error' gutterBottom>Server Error -- undef</Typography>
            )}

            <Button onClick={() => navigate('/catalog')}>Go back to the store</Button>
        </Container>
    )
}

