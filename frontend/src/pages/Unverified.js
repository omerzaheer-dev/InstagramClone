import { useNavigate} from "react-router-dom"
import axios from "../api/axios"
import OtpInput from "./otp-input";
import useAuth from "../hooks/useAuth";
import { useState } from "react";

const Unverified = () => {
  const {setAuth,auth}= useAuth()
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const onOtpSubmit = async (otp) => {
    try {
      const response = await axios.post('/api/v1/users/verify-email-otp',
        {
          otp,
          email:auth?.email
        }
      )
      console.log("res,re",response);
      if (response?.data?.data) {
        console.log(response);
        setAuth(prev=>{
          return {...prev, isVerified:true,role:["user"]}
        })
        navigate("/")
      }
    } catch (error) {
      if(error?.status===401){
        setError('User doesnot exist or already verified');
      }
      if(error?.status===402){
        setError('Otp doesnot exist in database');
      }
      if(error?.status===403){
        setError('Invalid Otp or otp is used');
      }
    }
  };

  return (
    <div>
        <div className="p-4">
        {error && ( <p className="mt-2 text-sm text-red-600">{error}</p> )}
          <p>Enter OTP sent to {auth?.email}</p>
          <OtpInput length={4} onOtpSubmit={onOtpSubmit} email={auth?.email} removeError={()=>{setError('')}}/>
        </div>
    </div>
  );
};

export default Unverified;