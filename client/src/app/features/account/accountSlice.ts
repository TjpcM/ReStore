import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { FieldValues } from "react-hook-form";
import { toast } from "react-toastify";
import { history } from "../../..";
import agent from "../../api/agent";
import { User } from "../../models/user";
import { setBasket } from "../Basket/basketSlice";

interface AccountState {
    user: User | null;
}

const initialState : AccountState ={
    user:null
}


export const  singInUser = createAsyncThunk<User, FieldValues>(
  'account/singInUser',
  async (data, thunkAPI) =>{
    try {
        const userDto = await agent.Account.login(data);
        const {basket, ...user} = userDto;
        if (basket) thunkAPI.dispatch(setBasket(basket));
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error:any) {
        return thunkAPI.rejectWithValue({error:error.data});        
    }
  }
);

export const  fetchCurrentUser = createAsyncThunk<User >(
    'account/fetchCurrentUser',
    async (_, thunkAPI) =>{
      thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)));
      try {
          const userDto = await agent.Account.currentUser();
          const {basket,...user} = userDto;
          if (basket) thunkAPI.dispatch(setBasket(basket));
          localStorage.setItem('user', JSON.stringify(user));
          return user;
      } catch (error:any) {
          return thunkAPI.rejectWithValue({error:error.data});        
      }
    },
    {
      condition:() =>{
        if(!localStorage.getItem('user')) return false;
      }
    }
  );
  
// do not forget to add reducer in configureStore
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers:{
      signOut:(state) =>{
        state.user = null;
        localStorage.removeItem('user');
        history.push('/');
      },
       setUser:(state,action)=>{
        state.user = action.payload;
      }
    },
    extraReducers:(builder =>{
        builder.addCase(fetchCurrentUser.rejected, (state) =>{
          state.user =null;
          localStorage.removeItem('user');
          toast.error('Sessionexpired - please login again');
          history.push('/');
        })
        builder.addMatcher(isAnyOf(singInUser.fulfilled,fetchCurrentUser.fulfilled), (state,action)=>{
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(singInUser.rejected),(state,action)=>{
          throw action.payload;
        });
    })
});

export const {signOut,setUser} = accountSlice.actions;