import { useSelect } from "@mui/base";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { basketSlice } from "../features/Basket/basketSlice";
import { catalogSlice } from "../features/catalog/catalogSlice";
import { counterSlice } from "../features/contact/counterSlice";


 export const store = configureStore({
    reducer:{
        counter:counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog:catalogSlice.reducer
    }
 })

/*without redux toolkit
 export function configureStore(){
    return createStore(counterReducer); // deprecated and replaced with configureStore()
} */


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;