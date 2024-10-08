import React ,{useRef , useState , useContext, useEffect} from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useSendOtpEmail from '../hooks/useSendOtpEmail';
import AuthContext from "../context/AuthProvider" 
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "../api/axios"
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const usernameRegex = /^[a-z](?!.*[_.]{2})[a-z0-9._]{2,29}$/;

const schema = z.object({
  username: z.string().min(4, 'Username is required').refine((text)=>
    usernameRegex.test(text),{
        message:"Invalid Username"
    }
  ),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').refine((text)=>
    passwordRegex.test(text),{
        message:"Password must include at least 1 special character number and capital letter"
    }
  ),
  confirmPassword: z.string().min(8, 'Confirm Password must be at least 8 characters').refine((text)=>
    passwordRegex.test(text),{
        message:"Invalid Confirm password"
    }
  ),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Confirm password and pssword dosent match',
  path: ['confirmPassword'],
});

const SignUp = () => {
  const {setAuth,auth} = useContext(AuthContext)
  const sendOtp = useSendOtpEmail();
  const location = useLocation()
  let from = location?.state?.from?.pathname || "/";
  const navigate = useNavigate()
    // const userRef = useRef()
    const errorRef = useRef()
    const [errMsg,setErrMsg] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode:"all",
  });

  //   const {username,email,password,confirmPassword} = data;
  //   try {
  //     setErrMsg("")
  //       const response = await axios.post('/api/v1/users/register',
  //         JSON.stringify({
  //           password,confirmPassword,email,username
  //         }),{
  //           headers:{'Content-Type':'application/json'},
  //           withCredentials:true
  //         }
  //       )
  //       console.log("aaa",response)
  //       const accesstoken=response?.data?.data?.accesstoken;
  //       const {username,role,isVerified,email,_id}=response?.data?.data?.user;
  //       setAuth({username,role,isVerified,email,accesstoken,_id})
  //       // await sendOtp(email)
  //       // navigate("/unverified")
  //   } catch (error) {
  //       if(!error.response){
  //         setErrMsg("no server response")
  //       }else if(error.response.status===409){
  //         setErrMsg("User with email or username already exists")
  //       }else{
  //         setErrMsg("Registration Failed")
  //       }
  //   }
  // };
  const onSubmit = async(data)=>{
    const {confirmPassword,email,password,username} = data;
    try {
      setErrMsg("")
      const response = await axios.post('/api/v1/users/register',
        JSON.stringify({
          password,confirmPassword,email,username
          }),{
            headers:{'Content-Type':'application/json'},
            withCredentials:true
          })
          const {role,isVerified,_id}=response?.data?.data?.user;
          const accesstoken=response?.data?.data?.accesstoken;
          setAuth({username,role,isVerified,email,accesstoken,_id})
          await sendOtp(email);
          navigate("/unverified");
    } catch (error) {
      if(!error.response){
        setErrMsg("no server response")
      }else if(error.response.status===409){
        setErrMsg("User with email or username already exists")
      }else{
        setErrMsg("Registration Failed")
      }
    }
  }

  return (
    <div>
        <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6">Sign Up</h2>
        <label ref={errorRef} className={errMsg ? "block text-red-600 text-lg":"offscreen"}>{errMsg}</label>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-white text-lg">Username</label>
            <input
              type="text"
              {...register('username')}
              autoComplete='off'
              className="w-full p-3 mt-1 bg-transparent border border-gray-700 text-white rounded"
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
          </div>
          <div>
            <label className="block text-white text-lg">Email</label>
            <input
              type="text"
              {...register('email')}
              className="w-full p-3 mt-1 bg-transparent border border-gray-700 text-white rounded"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-white text-lg">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full p-3 mt-1 bg-transparent border border-gray-700  text-white rounded"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-white text-lg">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className="w-full p-3 mt-1 bg-transparent border border-gray-700 text-white rounded"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-transparent border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition-colors">
            Sign Up
          </button>
        </form>
      </div>
        </div>
    </div>
  );
};

export default SignUp;
