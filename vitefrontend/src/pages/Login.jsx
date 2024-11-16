
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
} from "@/components/ui/form"
import Inp from "@/comps/Inp"
import { useEffect, useState } from "react"
import axios from "../api/axios"
import { Link, useLocation, useNavigate } from "react-router-dom"
import PasswordInput from "../comps/PasswordInput"
import useSendOtpEmail from "@/hooks/useSendOtpEmail"
import useAuth from "@/hooks/useAuth"
import { useDispatch } from "react-redux"
import { reset } from "@/redux/postSlice"

const usernameRegex = /^[a-z](?!.*[_.]{2})[a-z0-9._]{2,29}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const uppercase = /(?=.*[A-Z])/;
const lowercase = /(?=.*[a-z])/;
const number = /(?=.*\d)/;
const specialCharacter = /(?=.*[\W_])/;


const emailOrUsernameSchema = z.string().refine((value) => {
    return emailRegex.test(value) || usernameRegex.test(value);
}, {
    message: "Email or username is invalid"
});


const FormSchema = z.object({
    emailUsername: emailOrUsernameSchema,
    password: z.string().min(8, 'Password must be at least 8 characters').refine((text) => uppercase.test(text), {
        message: 'Password must include at least 1 uppercase letter',
    })
        .refine((text) => lowercase.test(text), {
            message: 'Password must include at least 1 lowercase letter',
        })
        .refine((text) => number.test(text), {
            message: 'Password must include at least 1 number',
        })
        .refine((text) => specialCharacter.test(text), {
            message: 'Password must include at least 1 special character',
        }),
})

const Login = () => {
    const dispatch = useDispatch();
    const { setAuth, auth } = useAuth()
    const sendOtp = useSendOtpEmail();
    const location = useLocation()
    const navigate = useNavigate()
    let from = location?.state?.from?.pathname || "/";
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            emailUsername: "",
            password: "",
        },
    })
    const onSubmit = async (data) => {
        setLoading(true);
        try {
            setError("")
            const response = await axios.post('/api/v1/users/login',
                JSON.stringify({
                    data,
                }), {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
            )
            dispatch(reset());
            const accesstoken = response?.data?.data?.accesstoken;
            // const { following } = response?.data?.data?.user;
            const { username, role, isVerified, email, following, _id, profilePicture, fullName } = response?.data?.data?.user;
            setAuth({ following, accesstoken, username, role, isVerified, following, email, _id, profilePicture, fullName, })
            if (!isVerified) {
                from = "/unverified"
                await sendOtp(email);
            }
            setLoading(false);
            navigate(from, { replace: true })
        } catch (error) {
            setLoading(false);
            if (!error.response) {
                setError("no server response")
            }
            else if (error.response.status === 402) {
                setError("Invalid username,email or password")
            }
            else if (error.response.status === 401) {
                setError("Invalid email or username format")
            }
            else {
                setError("Login attempt Failed")
            }
        }
    }
    return (
        <div className='flex items-center justify-center relative max-w-[100%] w-auto h-[100%] my-8 md:my-5'>
            <Form {...form}>
                <form className='flex shadow-2xl flex-col absolute top-[36vh] -translate-y-[50%] w-[90%] md:w-[68%] lg:w-[34%] p-4 md:p-7 gap-1' onSubmit={form.handleSubmit(onSubmit)}>
                    <div>
                        <div className="text-center text-lg font-bold">
                            <h1 className="text-2xl tracking-widest text-[#c13584]">Instagram</h1>
                        </div>
                        <div className="text-sm text-slate-500 text-center">Login to see photos & videos from your friends and family</div>
                    </div>
                    <p className="text-red-500 text-center font-semibold">{error}</p>
                    <div>
                        <div className="mb-4 mt-1">
                            <Inp label={"Email or Username"} placeholder={"emailUsername"} control={form.control} />
                            <PasswordInput label={"Password"} placeholder={"password"} control={form.control} />
                        </div>
                        <Button className="w-full" type="submit">
                            Login
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        </Button>
                        <p className="text-center mt-2 mr-[3px]">
                            <blockquote className="mt-2 border-l-2 pl-6 leading-7 [&:not(:first-child)]:mt-6">
                                Create a new account <Link to={"/register"} className=" cursor-pointer text-[#c13584] font-semibold">Signup</Link>
                            </blockquote>
                        </p>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default Login
