import { createSlice } from "@reduxjs/toolkit";

export interface CounterState{
    data:number;
    title:string;
}

const initialState:CounterState ={
    data:42,
    title: 'YARC (Yet another redux counter with Redux Toolkit) '
}

//It appears state are being mutated, but in background "immer" take care of it
export const counterSlice = createSlice({
    name:'counter',
    initialState,
    reducers:{
        increment:(state,action) => {
            state.data +=action.payload
        },
        decrement:(state,action) => {
            state.data -=action.payload
        }
    }
})

export const {increment , decrement} = counterSlice.actions;