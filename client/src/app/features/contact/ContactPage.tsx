import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/configureStore";
import { decrement, increment } from "./counterSlice";


export default function ContactPage(){
    const dispatch = useAppDispatch(); // to dispatch action's
    //useSelector takes to arguments: selector function and optionan comparison function
    const {data, title} = useAppSelector(state => state.counter);// To get the state in the store
    return(
        <>
        <Typography variant='h2'>
            {title}
        </Typography>

        <Typography variant='h5'>
           The data is: {data}
        </Typography>
        <ButtonGroup>
        {/* <Button onClick={() => dispatch({type: DECREMENT_COUNTER})} variant='contained' color='error'>Decrement</Button>
        <Button onClick={() => dispatch({type: INCREMENT_COUNTER})} variant='contained' color='primary'>Increment</Button> */}
        <Button onClick={() => dispatch(decrement(1))} variant='contained' color='error'>Decrement</Button>

        <Button onClick={() => dispatch(increment(1))} variant='contained' color='primary'>Increment</Button>
        <Button onClick={() => dispatch(increment(5))} variant='contained' color='secondary'>Increment by 5</Button>

        </ButtonGroup>

        </>
    )
}



/* import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

export const CounterComponent = ({ value }) => {
  const dispatch = useDispatch()
  const increaseCounter = useCallback(() => dispatch({ type: 'DECREMENT_COUNTER' }), [])
  return (
    <div>
      <span>{value}</span>
      <button onClick={increaseCounter}>Increase counter</button>
    </div>
  )
} */