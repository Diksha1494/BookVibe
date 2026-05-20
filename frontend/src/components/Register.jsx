import React,{ useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa"
import './Login.css'
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [message, setMessage] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [googleSubmitting, setGoogleSubmitting] = useState(false)
    const { registerUser,signInWithGoogle } = useAuth()
    const navigate = useNavigate()
     const {
          register,
          handleSubmit,
          // watch,
          formState: { errors },
        } = useForm()
  //register user
  const onSubmit = async(data)=> {
    
    try{
    setSubmitting(true)
    setMessage("")
    await registerUser(data.email,data.password, data.username);
    alert("User registered successfully!")
    navigate("/")
    }catch(error){
setMessage(error?.response?.data?.message || "Please enter a valid email and password.")
console.error("[REGISTER_UI]", {
  status: error?.response?.status,
  message: error?.response?.data?.message || error.message,
})
    } finally {
      setSubmitting(false)
    }
  }
 const handleGoogleSignIn = async() => {
    try {
      setGoogleSubmitting(true)
      setMessage("")
      await signInWithGoogle();
      alert("Registered successfully");
      navigate("/")
    } catch (error) {
      setMessage(error?.response?.data?.message || "Google sign in failed.")
console.error(error)
    } finally {
      setGoogleSubmitting(false)
    }
}
  return (
    <div>
      <div className='login-container'>
      <div className='login-box'>
        <h2 className='login-heading'>Register Yourself</h2>

        
          <form onSubmit={handleSubmit(onSubmit)}>
          <div className='form-group'>
            <label className='label' htmlFor="username">Username</label>
            <input
              {...register("username", { required: true })}
              type="text"
              name="username"
              id="username"
              placeholder='Username'
              className='input'
            />
            {errors.username && <p className='error-text'>Username is required.</p>}
          </div>

          <div className='form-group'>
            <label className='label' htmlFor="email">Email</label>
            <input
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              placeholder='Email Address'
              className='input'
            />
            {errors.email && <p className='error-text'>Email is required.</p>}
          </div>

          <div className='form-group'>
            <label className='label' htmlFor="password">Password</label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder='Password'
              className='input'
            />
            {errors.password && <p className='error-text'>Password is required.</p>}
          </div>

          {message && <p className='error-text'>{message}</p>}

          <div>
            <button className='login-button' disabled={submitting}>{submitting ? "Registering..." : "Register"}</button>
          </div>
        </form>

        <p className='redirect-text'>
          Already have an account?  <Link to="/login" className='text-blue-500 hover:text-blue-700'style={{textDecoration:"none"}}>Login</Link>
        </p>

        {/* Google sign in */}
        <div className='mt-4'>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className='google-button'
            disabled={googleSubmitting}
          >
            <FaGoogle className='mr-2' />
            {googleSubmitting ? "Signing up..." : "Sign Up with Google"}
          </button>
        </div>

        <p className='footer-text'>Copyright 2025 BookVibe. All rights reserved.</p>
      </div>
    </div>
    </div>
  )
}

export default Register;

