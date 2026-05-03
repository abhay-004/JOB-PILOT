'use client';
import { FormEvent, useState } from "react"
import Link from "next/link"
import { UserCheck, User, Mail, Lock, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { loginAction } from "@/features/auth/server/auth.actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginUserData } from "@/features/auth/auth.schema";

const Login:React.FC = () => {

    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<LoginUserData>({
      resolver:zodResolver(loginSchema)
    });
  
   

    const [showPassword, setShowPassword] = useState(false)

  
    const onSubmit = async(data:LoginUserData)=>{
      try {
        
        const result = await loginAction(data)
        if(result?.status === "success"){
          toast.success(result.message)
        }else{
          toast.error(result?.message)
        }
      } catch (error) {
        console.log(error)
        toast.error("Something went wrong")
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[450px] w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100">
        
        {/* Header Section */}
        <div className="flex flex-col items-center">
          <div className="bg-[#1877F2] p-4 rounded-full mb-5 shadow-sm">
            <UserCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Sign In Our Job Portal</h2>
          <p className="text-gray-500 text-sm">Login in your account to get started</p>
        </div>

        {/* Form Section */}
        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-11 py-6 text-base rounded-xl"
               {...register("email")}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-11 pr-11 py-6 text-base rounded-xl"
                autoComplete="new-password"
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-[#1877F2] hover:bg-blue-700 text-white py-6 text-base rounded-xl mt-4 font-semibold">
            Login
          </Button>
          
          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#1877F2] hover:underline font-semibold">
              Sign up here
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Login
