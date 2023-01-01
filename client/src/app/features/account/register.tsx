import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from '../../api/agent';
import { convertObjToArray } from '../../api/Util/util';
import { history } from '../../..';
import { toast } from 'react-toastify';

//Notes: RegExLib.com, use in pattern - regular expression site to consult templates
export default function Register() {
    const navigate = useNavigate();
    const {register, handleSubmit, setError, formState:{isSubmitting,errors,isValid}} = useForm({
      mode:'all'
      
      });

    function handleApiErrors(errors:any) {
        const {data}= errors; 
        const errorsArray = Object.keys(errors) ; // convert object to array
        if(!!data.errors){
      
         for(const key in data.errors){
          const warning = data.errors[key].toString();  
         
          if (warning.includes('Passwords')){
           console.log(warning);
            setError('password',{message:warning});
          }else if(warning.includes('Email')){
           console.log(warning);
           setError('email', {message:warning})
          }else if(warning.includes('Username')){
           console.log(warning);
           setError('username',{message:warning})
          }
    
        }

/*     !!!errors is not an array (as the instructor suggested)   
        errors.forEach((error:string )=> {
          if (error.includes('Password')){
            setError('password',{message:error});
          }else if(error.includes('Email')){
            setError('email', {message:error})
          }else if(error.includes('Username')){
            setError('username',{message:error})
          }
      }); */   
    }
   }

    return (
      <Container component={Paper} maxWidth="sm" 
                sx={{display:'flex', flexDirection:'column', alignItems:'center', p:4}}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box component="form" onSubmit={handleSubmit((data) => 
            agent.Account.register(data)
              .then(()=>{
                toast.success('Registration successful - you can now login');
                //history.push('/login');
                navigate('/login');
              })
              .catch((error:any)=> handleApiErrors(error)))
              } 
            noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Username"
              autoFocus
              autoComplete='username'
              {...register('username', {required:'Username is required'})}
              error = {!!errors.username}  
              helperText={errors?.username?.message?.toString()}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email address"
              {...register('email', {required:'Email is required',
              pattern:{
                value:/^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/,
                message:'Not a valid email address'
              }})}
              error = {!!errors.email}  
              helperText={errors?.email?.message?.toString()}
            />

            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              autoComplete='current-password'
              {...register('password', {required:'Password is required',
              pattern:{
                value:/(?=^.{6,10}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/,
                message:'password does not meet complexity requirements'
              } })}
              error = {!!errors.password}  
              helperText={errors.password?.message?.toString()}
            />

            <LoadingButton loading={isSubmitting}
              disabled={!isValid}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </LoadingButton>
            <Grid container>
             <Grid item>
                <Link to ='/login'>
                  {"Already have an account? Sign In"}
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
