import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { useAppDispatch } from '../../store/configureStore';
import { singInUser } from './accountSlice';
import { history } from '../../..';


export default function Login(props:any) {
    const navigate = useNavigate();
    
    const dispatch = useAppDispatch();
    const location:any=  useLocation();

    const {register, handleSubmit, formState:{isSubmitting,errors,isValid}} = useForm({
      mode:'all' 
    });
    async function submitForm(data: FieldValues){ //FieldValues - we get back from react hook form
 /*      try {
        await agent.Account.login(data);
      } catch (error) {
        console.log(error);
      }
  */   
 
     
       try {
        await dispatch(singInUser(data));
        console.log('location.state: ' + location.state.from);
        history.push(location.state?.from?.pathname || '/catalog');       
      }catch (error:any) {
          console.log(error);	
      	}
      } 
// !! - cast to boolean if the object exist
  
      return (
        <Container component={Paper} maxWidth="sm" 
                sx={{display:'flex', flexDirection:'column', alignItems:'center', p:4}}>
           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
             Sign in
           </Typography>
            <Box component="form" onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              autoFocus
              {...register('username', {required:'Username is required'})}
              error = {!!errors.username}  
              helperText={errors?.username?.message?.toString()}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register('password', {required:'Password is required'})}
              error = {!!errors.password}  
              helperText={errors?.password?.message?.toString()}
            />
            
            <LoadingButton loading={isSubmitting}
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </LoadingButton>
            <Grid container>
             <Grid item>
                <Link to ='/register'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
      </Container>
  );
}



/*     const [values, setValues] = useState({
        username:'',
        password:''
    });
    const handleSubmit = (event:any) => {
        event.preventDefault();
      agent.Account.login(values);
     };

     function handleInputChange(event:any){
        const {name,value} = event.target;
        setValues({...values,[name]:value});

     }
 */
