import React from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { useState } from 'react'
import axios from '../axios/Axios'
import { registerURL } from '../constants/Constants'

function Signup() {
    const [formData, setFormData] = useState({  
        email: '',
        password: '',
        confirm_password: ''
    })
    console.log(formData)
    const [error, setError] = useState({})
    const [serverError, setServerError] = useState()
    const navigate = useNavigate()
    
    console.log(error)
    const handleChange = (e) => {
      const {name, value} = e.target
      setFormData({
        ...formData, [name]: value
      })
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      setServerError()
      if (formValidate()) {
        setError({})
        axios
        .post(
          registerURL,
          JSON.stringify(formData)
        )
        .then((res) => {
        
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
          });
          navigate("/login", { replace: true });
        })
        .catch((err) => {          
          if (err.code === "ERR_NETWORK") {
            setServerError("Network error. Please check after some time.");
          } else if (err.response.status === 400) {
            if (err.response.data.username) {
              setServerError(err.response.data.username);
            }

            if (err.response.data.email) {
              setServerError(err.response.data.email);
            }

            if (err.response.data.password) {
              setServerError(err.response.data.password);
            }
          }
        });
      }
    }
  
    const formValidate = () => {
      const validationErrors = {}
      let is_valid = true

      if (!formData.email.trim()) {
        validationErrors.email = "email is required"
        is_valid = false
      }else if(!/\S+@\S+\.\S+/.test(formData.email)){
        validationErrors.email = "email is not valid"
        is_valid = false
      }
  
      if (!formData.password.trim()) {
        validationErrors.password = "password is required"
        is_valid = false
      }else if(formData.password.length < 6){
        validationErrors.password = "password must be at least 6 characters"
        is_valid = false
      }

      if (!formData.confirm_password.trim()) {
        validationErrors.confirm_password = "confirm password is required"
        is_valid = false
      }

      if (formData.password !== formData.confirm_password) {
        validationErrors.confirm_password = "password doesn't match"
        is_valid = false
      }
  
      setError(validationErrors)
      return is_valid
    }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center">myIntro</h1>
        <button className="bg-white text-black border rounded-lg w-full py-2 mb-4 flex items-center justify-center">
          <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" className="mr-2" />
          Continue with Google
        </button>
        <div className="flex items-center justify-between mb-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="px-2 text-gray-500">Or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input onChange={handleChange} name='email' type="email" id="email" className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="rakesh4322@gmail.com" />
            {error.email && <span style={{color:'red'}}>{error.email}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Password</label>
            <input onChange={handleChange} name='password' type="password" id="password" className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            {error.password && <span style={{color:'red'}}>{error.password}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="confirm_password" className="block text-gray-700">Confirm Password</label>
            <input onChange={handleChange} type="password" name='confirm_password' id="password" className="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            {error.confirm_password && <span style={{color:'red'}}>{error.confirm_password}</span>}
          </div>
          
          <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded-lg disabled:opacity-50">Continue</button>
          {serverError && <div style={{
  color: '#e74c3c',
  border: '1px solid #e74c3c',
  fontSize: '13px',
  marginTop: '5px',
  padding: '10px',
  borderRadius: '10px',
  textAlign: 'center',
}}>
                <p>{serverError}</p>
            </div>}
        </form>
        <p className="mt-4 text-center text-gray-500">
          Have account in MyIntro? <Link to='/login' className="text-blue-500">Login</Link>
          
        </p>
      </div>
      <footer className="w-full py-4 mt-8 bg-white">
        <div className="text-center text-gray-500">
          <p>&copy; 2024 - Copyright @ MyIntro</p>
          <div className="mt-2">
            <a href="#" className="text-gray-500 mx-2">Support</a>
            <a href="#" className="text-gray-500 mx-2">Privacy Policy</a>
            <a href="#" className="text-gray-500 mx-2">English (EN)</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Signup