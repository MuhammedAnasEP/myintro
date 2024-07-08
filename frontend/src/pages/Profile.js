import React, { useEffect } from 'react'
import { useState } from 'react'
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import useAuth from '../hooks/useAuth'
import { personalURL } from '../constants/Constants'
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
import useLogout from '../hooks/useLogout'

function Profile() {
  const [serverError, setServerError] = useState()
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    full_name: '',
    location: '',
    phone_number: '',
    summary: '',
  })
  const [loading, setLoading] = useState(false)
  const logout = useLogout()
  
  const navigate = useNavigate()

  const axios = useAxiosPrivate()
  const { user } = useAuth()

  useEffect(() => {
    getPersonalDetails();
  }, []);

  const getPersonalDetails = () => {
    axios
      .get(personalURL)
      .then((response) => {
        setFormData(response.data)
      })
      .catch((error) => {

        if (error.code === "ERR_NETWORK") {
          setServerError("Network Error");
        }
        setServerError(error.response?.data?.detail);
      });
  };



  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData, [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setServerError()
    axios
      .put(
        personalURL,
        JSON.stringify(formData)
      )
      .then((res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "",
          showConfirmButton: false,
          timer: 1000,
        });
        navigate("/profile", { replace: true });
      })
      .catch((err) => {
        if (err.code === "ERR_NETWORK") {
          setServerError("Network Error");
        } else if (err.response.status === 401) {
          setServerError("UnAuthorized");
        } else if (err.response.status === 400) {
          setServerError(err.response.data.detail);
        } else if (err.response.status === 500) {
          setServerError("Somthing Went worng, Check the field and try again");
        }
      });

  }
  async function onLogout() {
    setLoading(true)

    await logout()
    navigate('/login')
}

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 ">
      <header className="bg-white shadow w-full">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">myIntro</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.username}</span>
            <img
              className="h-8 w-8 rounded-full "
              src="https://via.placeholder.com/150"
              alt="Profile"
              />
              <button disabled={loading} onClick={onLogout} className='ml-5'>Logout</button>
          </div>
        </div>
      </header>
      <main className="flex-grow w-full max-w-4xl mx-auto py-12 px-6 mb-8">
        <form className="bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Create your Profile</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Upload Resume</label>
            <input
              type="file"
              className="mt-2 w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex items-center mb-6">
            <span className="text-gray-500 mx-4">OR</span>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
              Record
            </button>
          </div>
        </form>
        <form onSubmit={handleSubmit} className="bg-white p-8 shadow-lg rounded-lg">

          <h3 className="text-lg font-semibold mb-2">Personal Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input onChange={handleChange}
                name='title'
                type="text"
                value={formData?.title}
                className="mt-2 w-full px-4 py-2 border rounded-lg"
                placeholder="e.g. UX Director"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                onChange={handleChange}
                name='email'
                type="email"
                value={formData?.email}
                className="mt-2 w-full px-4 py-2 border rounded-lg"
                placeholder="rakesh123@gmail.com"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Full Name</label>
              <input
                onChange={handleChange}
                name='full_name'
                type="text"
                value={formData?.full_name}
                className="mt-2 w-full px-4 py-2 border rounded-lg"
                placeholder="Rakesh Maurya"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location</label>
              <input
                onChange={handleChange}
                name='location'
                type="text"
                value={formData?.location}
                className="mt-2 w-full px-4 py-2 border rounded-lg"
                placeholder="Sample Text"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Phone Number</label>
              <input
                onChange={handleChange}
                name='phone_number'
                type="text"
                value={formData?.phone_number}
                className="mt-2 w-full px-4 py-2 border rounded-lg"
                placeholder="Rakesh Maurya"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Summary</label>
              <input
                onChange={handleChange}
                name='summary'
                type="text"
                value={formData?.summary}
                className="mt-2 w-full px-4 py-2 border rounded-lg"
                placeholder="Sample Text"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg">Next</button>
          </div>
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
        <form className="bg-white p-8 shadow-lg rounded-lg">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Social Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['X', 'Instagram', 'LinkedIn', 'YouTube'].map((platform, index) => (
                <div key={index} className="flex items-center border rounded-lg p-2">
                  <span className="mr-2">@</span>
                  <input
                    type="text"
                    className="flex-grow px-2 py-1 border-none focus:outline-none"
                    placeholder={platform}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg" disabled>Next</button>
          </div>
        </form>
      </main>
      <footer className="bg-white w-full py-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">&copy; 2024 - Copyright @ MyIntro</p>
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

export default Profile