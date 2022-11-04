import { Button, Divider, Paper, Typography } from "@mui/material";
import Container from "@mui/material/Container";
import { BrowserRouterProps, useLocation } from "react-router-dom";
import {  useNavigate } from "react-router-dom";
import { BrowserHistory } from "history";


//interface Props extends BrowserRouterProps {
  interface Props {
    history: BrowserHistory;
    
  } 
  
 
  interface location {
    state:{
      error:{
        tilte:string;
        status:number;
        detail:string;
      
      }
    }  ;
  } 
   
  

export default function ServerError({history}:Props){
    
    /*let [state, setState] = useState({
    
        action: history.action,
        location: history.location
      });
      useLayoutEffect(() =>{
        history.listen(setState);
    } , [history] );
      //const navigate = useNavigate();// useHistory replaced by useNavigation()
      //let {state}:any =useLocation();   
      //let {error}:any =state;  */ 
      const navigate = useNavigate();// useHistory replaced by useNavigation()
    // let {location} = history;
//    const error = useRouteError();
      //const {location} =history.location.state;
      //console.log(`state.error : ${state.error}`)
      //const history =useHistory();
      //let {state}:any =location;
      //let {error}:any =state;
      let { state }:any = useLocation();
      console.log(`history.location.key : ${history.location.key}`) ;
      
       

    return(
   
    <Container component={Paper}>
        
        {state.error  ? (
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

