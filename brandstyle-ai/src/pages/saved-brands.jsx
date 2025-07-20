import React from "react"
import "../components/css/savedBrand.css"
import Login from "../components/login";
import { useAuth } from "../authContext";
const SavedBrands = () => {
  const { user, token } = useAuth()

  return (
    <div className="container">
      <h3 className="page-title">Your Favourite Brands</h3>
      {
        token ?
          <p>This is a collection of the brands themes you saved.</p>
          : <div>
            <p>Login or Sign up to see your saved brands.</p>
            <div className="upload">
              <Login />
            </div>
          </div>

      }
      {user && <div>{user.email}</div>}

    </div>
  )
}
export default SavedBrands
