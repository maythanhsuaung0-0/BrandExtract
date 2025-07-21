import React, { useState } from "react"
import { Button } from '@swc-react/button'
import '../components/css/auth.css'
import { login, register } from "../services/auth"
import toast from 'react-hot-toast'
import { useAuth } from "../authContext"
import Modal from "./modal"
const Login = () => {
  const { user, token, setUpLogin } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [isError, setIsError] = useState(false)
  const [emailInvalidError, setEmailInvalidError] = useState(false)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const handleInputChange = (e) => {
    console.log(e, 'change')
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

  }
  // signing in/up
  const handleSubmit = async (e) => {

    e.preventDefault()
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        setIsError(true)
        toast.error('Passwords must be the same')
      }

      if (!emailRegex.test(formData.email)) {
        setEmailInvalidError(true)
        toast.error('Email is invalid')

      }
      if (formData.confirmPassword !== '' && formData.email !== '' &&
        formData.password !== '') {

        let data = { email: formData.email, password: formData.password }
        let res = await register(data)
        console.log("Signup attempt:", res)
      }

    } else {
      let data = { email: formData.email, password: formData.password }
      // call api
      let res = await login(data)

      console.log("Login attempt:", res)
      if (res) {
        localStorage.setItem("access_token", res.access_token)
        setUpLogin(res)
      }
    }

  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    })
  }

  const closeModal = (state) => {
    setIsOpen(state)
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    })
  }
  return (
    <div className="authContainer">
      <Button onClick={() => setIsOpen(true)} className="openButton">
        Sign In/Sign Up
      </Button>
    {isOpen &&
      <Modal isOpen={isOpen} closeModal={closeModal}>
        {isLogin ?
          (
            <div>
              <div className="header">
                <h3 className="title" >Welcome Back </h3>
                <p className="subtitle">
                  Sign in to your account to continue              </p>
              </div>

              <form className="form"
                onSubmit={handleSubmit}
              >
                <div className="inputGroup">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label className="label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>



                <Button
                  onClick={handleSubmit}
                  type="submit" className="submitButton">

                  Sign In </Button>
              </form>

              <div className="footer" >
                <span className="footerText" >{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
                <button type="button" onClick={toggleMode}
                  className="link-btn">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* for register */}
              <div className="header">
                <h3 className='title'>
                  Sign Up
                </h3>
                <p>  Join us today and get started
                </p>
              </div>
              <form
                className="form"
                onSubmit={handleSubmit}
              >

                <div className="inputGroup">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    onFocus={() => setEmailInvalidError(false)}
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`${emailInvalidError ? 'err' : 'input'}`}
                    required
                  />
                </div>

                <div className="inputGroup">
                  <label className="label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input"
                    required
                  />
                </div>
                <div className="inputGroup">
                  <label className="label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    onFocus={() => setIsError(false)}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${isError ? 'err' : 'input'}`}
                    required={!isLogin}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  type="submit" className="submitButton">
                  Create Account </Button>

              </form>

              <div className="footer" >
                <span className="footerText" >{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
                <button type="button" onClick={toggleMode}
                  className="link-btn">
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </div>
          )
        }
      </Modal>
    }
    </div>


  )
}
export default Login


