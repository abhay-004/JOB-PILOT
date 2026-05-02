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

import { registerAction } from "./registerActions.action";
import { toast } from "sonner";


//type define for register form data
interface RegisterFormData {
  name: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'applicant' | 'employer'
}

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "applicant",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRoleChange = (value: 'applicant' | 'employer') => {
    setFormData({ ...formData, role: value })
  }

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault()
    
    const registerData = {
      name:formData.name.trim(),
      userName:formData.userName.trim(),
      email:formData.email.toLowerCase().trim(),
      password:formData.password,
      role:formData.role
    }

    if(formData.password !== formData.confirmPassword){
      return toast.error("Password is not matching")
    }
     const result = await registerAction(registerData)
     if(result?.status === "success"){
      toast.success(result.message)
      setFormData({
        name: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "applicant",
      })
     }else{
      toast.error(result?.message)
     }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-112.5 w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.05)] border border-gray-100">

        {/* Header Section */}
        <div className="flex flex-col items-center">
          <div className="bg-[#1877F2] p-4 rounded-full mb-5 shadow-sm">
            <UserCheck className="w-8 h-8 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Join Our Job Portal</h2>
          <p className="text-gray-500 text-sm">Create your account to get started</p>
        </div>

        {/* Form Section */}
        <form  className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                className="pl-11 py-6 text-base rounded-xl"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="userName" className="text-sm font-semibold">Username *</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="userName"
                name="userName"
                type="text"
                placeholder="Choose a username"
                className="pl-11 py-6 text-base rounded-xl"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="pl-11 py-6 text-base rounded-xl"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-semibold">I am a *</Label>
            <input type="hidden" name="role" value={formData.role} />
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-full py-6 text-base rounded-xl bg-white border border-gray-300">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-md rounded-xl z-50">
                <SelectItem value="applicant" className="cursor-pointer py-2 hover:bg-gray-50 focus:bg-gray-50 rounded-lg outline-none transition-colors">Job Applicant</SelectItem>
                <SelectItem value="employer" className="cursor-pointer py-2 hover:bg-gray-50 focus:bg-gray-50 rounded-lg outline-none transition-colors">Employer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                className="pl-11 pr-11 py-6 text-base rounded-xl"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold">Confirm Password *</Label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pl-11 pr-11 py-6 text-base rounded-xl"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-[#1877F2] hover:bg-blue-700 text-white py-6 text-base rounded-xl mt-4 font-semibold">
            Create Account
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1877F2] hover:underline font-semibold">
              Sign in here
            </Link>
          </p>

        </form>
      </div>
    </div>
  )
}

export default Register
