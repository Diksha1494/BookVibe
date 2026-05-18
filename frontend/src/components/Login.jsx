import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaGoogle } from "react-icons/fa"
import './Login.css'
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';


const Login = () => {
	  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [googleSubmitting, setGoogleSubmitting] = useState(false)
  const { loginUser,signInWithGoogle} = useAuth();
	  const navigate = useNavigate()
	   const {
	        register,
	        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()

const onSubmit = async (data)=> {
 
	   try{
      setSubmitting(true)
      setMessage("")
	    await loginUser(data.email,data.password);
	    alert("logged in successfully!");
	    navigate("/")
	    }catch(error){
	setMessage(error?.response?.data?.message || "Please enter a valid email and password")
	console.error(error)
	    } finally {
      setSubmitting(false)
	    }
	}
const handleGoogleSignIn = async() => {
	    try {
        setGoogleSubmitting(true)
        setMessage("")
	      await signInWithGoogle();
	      alert("Login successfull1");
	      navigate("/")
	    } catch (error) {
	      setMessage(error?.response?.data?.message || "Google sign in failed")
	console.error(error)
	    } finally {
        setGoogleSubmitting(false)
	    }
	}
  return (
    <div className='login-container'>
      <div className='login-box'>
        <h2 className='login-heading'>Please Login</h2>

        
          <form onSubmit={handleSubmit(onSubmit)}>
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
          </div>

	          {message && <p className='error-text'>{message}</p>}

	          <div>
	            <button className='login-button' disabled={submitting}>{submitting ? "Logging in..." : "Login"}</button>
	          </div>
	        </form>

        <p className='redirect-text'>
          Haven't an account? Please <Link to="/register" className='text-blue-500 hover:text-blue-700' style={{textDecoration:"none"}}>Register</Link>
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
	            {googleSubmitting ? "Signing in..." : "Sign in with Google"}
	          </button>
	        </div>

        <p className='footer-text'>Copyright 2025 BookVibe. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Login;

