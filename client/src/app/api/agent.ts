import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { config } from "process";
import { toast } from "react-toastify";
import { history } from "../..";
import { PaginatedResponse } from "../models/pagination";
import { store } from "../store/configureStore";

const sleep = () => new Promise(resolve => setTimeout(resolve, 500))

axios.defaults.baseURL ='http://localhost:5000/api/'; // base url
axios.defaults.withCredentials=true;
const reponseBody =(response:AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
    const token = store.getState().account.user?.token;
    if (token && typeof config.headers != 'undefined') config.headers.Authorization = `Bearer ${token}`;
    return config;
})

axios.interceptors.response.use(async response => {
    //await sleep();
     await sleep();
    const pagination = response.headers['pagination']; //'pagination' in lower cases
    if (pagination){
        response.data = new PaginatedResponse(response.data, JSON.parse(pagination));
        return response;
    }
    return response;
}, (error) => {
    const {data} = error.response!;
     
     const {status} =  data;
     console.log(data);

    // ! override type safety here;// ! override type safety here
  
   // if (typeof data === 'object' && data !== null){
        //console.log('data: ...' + data);
        switch (status) {
       case 400:
        if(data.errors){
            const modelStateErrors: string[] = []; 
            for(const key in data.errors){
                
                if (data.errors[key]){
                    modelStateErrors.push(data.errors[key]);
                }
              }
              throw modelStateErrors.flat();
            }
            toast.error(data.title);
            break;
        case 401:
            toast.error(data.title);
            break;
        case 500:

/*           const location ={pathname:'/server-error',  error:data}   ;
         console.log(`data : ${data}`);
 */
        //const stateCopy = { ...data };
        // history.replace({  pathname :"/server-error"},{ state:{error: stateCopy }});

       // history.push({
       //     pathname: '/server-error',
       //     state: {error: data}
       // });

         history.push({
           pathname :'/server-error'}, 
        {error:data}
        );
        
        console.log(history.location)
          break;
                            
        default:
            break;
    }

    return Promise.reject(error.response);
})

const requests = {
    get: (url: string, params?:URLSearchParams) => axios.get(url, {params}).then(reponseBody),//axios.get can take a config, thal allows to a params object
    post: (url: string, body:{}) => axios.post(url,body).then(reponseBody),
    put: (url: string, body:{})  => axios.put(url,body).then(reponseBody),
    delete: (url: string) => axios.delete(url).then(reponseBody)
}

const Catalog = {
    list: (params:URLSearchParams) => requests.get('products', params),
    details: (id:number) => requests.get(`products/${id}`),
    fetchFilters:()  => requests.get('products/filters')
}

const TestErrors = {
    get400Error: () => requests.get('buggy/bad-request'),
    get401Error: () => requests.get('buggy/unauthorised'),
    get404Error: () => requests.get('buggy/not-found'),
    get500Error: () => requests.get('buggy/server-error'),
    getValidationError: () => requests.get('buggy/validation-error'),
 }

 const Basket ={
    get:() => requests.get('basket'),
    addItem:(productId:number, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`,{}),
    removeItem:(productId:number, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
 }

 const Account ={
    login: (values:any) => requests.post('account/login',values),
    register: (values:any) => requests.post('account/register',values),
    currentUser: () => requests.get('account/currentUser')
 }

const agent = {
    Catalog,
    TestErrors,
    Basket,
    Account
}


export default agent;

