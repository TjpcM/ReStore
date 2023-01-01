import { ThemeProvider } from "@emotion/react";
import { createTheme, CssBaseline } from "@mui/material";
import { Container } from "@mui/system";
import {  useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AboutPage from "../features/about/AboutPage";
import ProductDetais from "../features/catalog/ProductDetails";
import ContactPage from "../features/contact/ContactPage";
import HomePage from "../features/home/HomePage";
import Header from "./Header";
import 'react-toastify/dist/ReactToastify.css';
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import { history } from "../..";
import BasketPage from "../features/Basket/BasketPage";
import LoadingComponent from "./LoadingComponent";
import { fetchBasketAsync } from "../features/Basket/basketSlice";
import { useAppDispatch } from "../store/configureStore";
import Login from "../features/account/login";
import Register from "../features/account/register";
import { fetchCurrentUser } from "../features/account/accountSlice";
import Catalog from "../features/catalog/Catalog";
import PrivateRoute from "./PrivateRoute";



function App(){
  //const {setBasket} = useStoreContext(); 
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);

  //useCallback will return a memorized version of the callback that only changes if one of the inputs has changed.
 const initApp = useCallback(async () =>{
  try {
    await dispatch(fetchCurrentUser());
    await dispatch(fetchBasketAsync());
  } catch (error:any) {
    console.log({error:error.data});
  }
},[dispatch] )

  useEffect(() => {
    initApp().then(() => setLoading(false));
  },[initApp]);

const [darkMode, setDarkMode] =useState(false);
const paletteType = darkMode ? 'dark' :'light';
 const theme = createTheme({
  palette:{
    mode: paletteType,
    background:{
      default:paletteType === 'light' ? '#eaeaea' :'#121212'
    }
  }
 })
//  <Route  path='*'           element={<NotFound/>} />  ---- default route
// <Route     component={NotFound} />       earlier version
 function handleThemeChange(){
   setDarkMode(!darkMode);
 }
 if (loading) return <LoadingComponent message ='Initialising app ...'/>
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right'  hideProgressBar/>
       <CssBaseline/>
        <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
        <Container >
          <Routes >           
             <Route  path='*'           element={<NotFound/>} />   
             <Route path='/'  element={<HomePage/>}/>
             <Route path='/catalog' element={<Catalog/>} />
             <Route path='/catalog/:id' element={<ProductDetais/>} />
             <Route path='/about' element={<AboutPage history={ history}/>} />
             <Route path='/contact' element={<ContactPage/>} />
             <Route path='/server-error'  element={<ServerError history={history} /> }   />
             <Route path='/basket'  element={<BasketPage  /> }   />
             <Route path='/checkout' element={<PrivateRoute location={history.location}/>} />

             <Route path = '/login' element ={<Login/>} />
             <Route path ='/register' element ={<Register />} />
          </Routes>
        </Container>
   
       </ThemeProvider>
  );
}

export default App;

