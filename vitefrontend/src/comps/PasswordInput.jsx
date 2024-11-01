import { Input } from "@/components/ui/input"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
const PasswordInput = ({ label, placeholder, control }) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div className="my-1">
            <FormField
                control={control}
                name={placeholder}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <div className='flex items-center justify-between focus-within:border-[1px] border-[1px] dark:border-slate-800 dark:bg-slate-950 rounded-md border-slate-200'>
                                <Input type={showPassword === true ? 'password' : 'text'} className="w-ful h-7 focus-visible:ring-0 focus-visible:ring-offset-0  border-none " placeholder={placeholder} {...field} />
                                <div className='cursor-pointer pr-2' onClick={() => setShowPassword(!showPassword)}>

                                    {
                                        showPassword === true ? <span><FaEyeSlash /></span> : <span><FaEye /></span>
                                    }

                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}

export default PasswordInput
