import React from 'react'
import '../components/css/auth.css'
const SignUp = () => {
  <div>
    <h3 className='title'>

    </h3>
    <p>  "Join us today and get started"
    </p>
    <form>
      <div className="inputGroup">
        <label className="label">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="input"
          required={!isLogin}
        />
      </div>
      <div className="inputGroup">
        <label className="label">Last Name</label>

        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          className="input"
          onChange={handleInputChange}
          required={!isLogin}
        />
      </div>

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
      <div className="inputGroup">
        <label className="label">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className="input"
          required={!isLogin}
        />
      </div>

      <Button
        onClick={handleSubmit}
        type="submit" className="submitButton">
        Create Account            </Button>

    </form>

    <div className="footer" >
      <span className="footerText" >{isLogin ? "Don't have an account? " : "Already have an account? "}</span>
      <button type="button" onClick={toggleMode}
        className="link-btn">
        {isLogin ? "Sign up" : "Sign in"}
      </button>
    </div>
  </div >
}
export default SignUp
