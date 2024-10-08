/* eslint-disable react/prop-types */
import {useEffect, useRef, useState} from "react";
import useSendOtpEmail from "../hooks/useSendOtpEmail";

const OtpInput = ({length = 4, onOtpSubmit = () => {},email="",removeError=()=>{}}) => {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  const sendOtp = useSendOtpEmail();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;
    removeError()
    const newOtp = [...otp];
    // allow only one input
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // const combinedOtp = newOtp.join("");
    // if (combinedOtp.length === length) onOtpSubmit(combinedOtp);

    // Move to next input if current field is filled
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // optional
    if (index > 0 && !otp[index - 1]) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      // Move focus to the previous input field on backspace
      inputRefs.current[index - 1].focus();
    }
  };
  const handleSubmit = async ()=>{
    if(otp.join("").length===4){
      onOtpSubmit(otp.join(""))
    }
  }

  return (
    <div >
      <div className="flex items-center gap-4">
        <div>
        {otp.map((value, index) => {
          return (
            <input
              key={index}
              type="text"
              ref={(input) => (inputRefs.current[index] = input)}
              value={value}
              onChange={(e) => handleChange(index, e)}
              onClick={() => handleClick(index)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-[40px] h-[40px] m-[5px] text-center text-[1.2em]"
            />
          );
        })}
      </div>
      <div className="text-blue-500 text-xl cursor-pointer" onClick={async()=>await sendOtp(email)}>Resend Otp</div>
      </div>
    <div>
      <button onClick={handleSubmit} className="mx-4 my-3 px-3 py-[6px] bg-black text-blue-600 hover:border-none hover:text-white border-1 border-blue-600 hover:bg-blue-600">Submit Otp</button>
    </div>
    </div>
  );
};

export default OtpInput;