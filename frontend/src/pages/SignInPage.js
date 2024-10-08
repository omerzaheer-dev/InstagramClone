import React ,{useEffect, useRef , useState } from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import useToggle from '../hooks/useToggle';
import useInput from '../hooks/useInput';
import useAuth from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "../api/axios"
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const usernameRegex = /^[a-z](?!.*[_.]{2})[a-z0-9._]{2,29}$/;

const schema = z.object({
  emailUsername: z.string()
  .refine((val) => usernameRegex.test(val), {
    message: 'Invalid username',
    path: ['identifier']
  })
  .or(z.string().email({ message: 'Invalid email' })),
  passwordSignIn: z.string().min(8, 'Password must be at least 8 characters').refine((text)=>
    passwordRegex.test(text),{
        message:"Password must include at least 1 special character number and capital letter"
    }
  ),
});

const SignInPage = () => {
  const [emailUsername, emailUsernameResetUser,emailUsernameAttributeObj] = useInput('emailUsername','');
  const [passwordSignIn, passwordSignInResetUser,passwordSignInAttributeObj] = useInput('passwordSignIn','');
  const [check,toggleCheck] = useToggle('persist',false);
  const location = useLocation()
  const navigate = useNavigate()
  const from = location?.state?.from?.pathname || "/";
  const {setAuth,auth} = useAuth()
    const errorRef = useRef();
    const [errMsg,setErrMsg] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode:"all",
    defaultValues: {
      emailUsername:emailUsername,
      passwordSignIn: passwordSignIn
    }
  });
  // const togglePersist = () => {
  //   setPersist(prev => !prev)
  // }
  // useEffect(()=>{
  //   localStorage.setItem("persist",persist)
  // },[persist])

  const onSubmit = async(data) => {
    const {emailUsername,passwordSignIn}=data;
    passwordSignInResetUser()
    try {
      setErrMsg('')
        const response = await axios.post('/api/v1/users/login',
          JSON.stringify({
            emailUsername,password:passwordSignIn,
          }),{
            headers:{'Content-Type':'application/json'},
            withCredentials:true
          }
        )
        const accesstoken=response?.data?.data?.accesstoken;
        const {username,role,isVerified,email,_id}=response?.data?.data?.user;
        setAuth({username,role,isVerified,email,accesstoken,_id})
        navigate(from,{replace:true})
    } catch (error) {
        if(!error.response){
          setErrMsg("no server response")
        }else if(error.response.status===401){
          setErrMsg("Invalid email or username format")
        }
        else if(error.response.status===402){
        setErrMsg("User doesnot exist")
        }
        else if(error.response.status===403){
        setErrMsg("Invalid User Cradentials")
        }else{
          setErrMsg("Login Failed")
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6">Sign In</h2>
        <label ref={errorRef} className={errMsg ? "block text-red-600 text-lg":"offscreen"}>{errMsg}</label>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-white text-lg">Email Or UserName</label>
            <input
              type="text"
              {...register('emailUsername')}
              {...emailUsernameAttributeObj}
              autoComplete='off'
              className="w-full p-3 mt-1 bg-transparent border border-gray-700 text-white rounded"
            />
            {errors.emailUsername && <p className="text-red-500 text-sm">{errors.emailUsername.message}</p>}
          </div>
        
          <div>
            <label className="block text-white text-lg">Password</label>
            <input
              type="password"
              {...register('passwordSignIn')}
              {...passwordSignInAttributeObj}
              className="w-full p-3 mt-1 bg-transparent border border-gray-700  text-white rounded"
            />
            {errors.passwordSignIn && <p className="text-red-500 text-sm">{errors.passwordSignIn.message}</p>}
          </div>
          <div className='flex items-center justify-center gap-2'>
            <input type="checkbox" id='persist' onChange={toggleCheck} checked={check} />
            <label htmlFor='persist' className="block text-white text-lg">Trust this device</label>
          </div>
          <button type="submit" className="w-full py-3 mt-4 bg-transparent border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition-colors">
            Sign In
          </button>
          <button onClick={()=>console.log("oo",auth)} type="submit" className="w-full py-3 mt-4 bg-transparent border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white transition-colors">
            Sign
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignInPage;
