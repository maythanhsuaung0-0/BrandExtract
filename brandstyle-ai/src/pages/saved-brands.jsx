import React from "react"
import "../components/css/savedBrand.css"
import Login from "../components/login";
const SavedBrands = () => {
  let brands;
  return (
    <div className="container">
      <h3 className="page-title">Your Favourite Brands</h3>
      {
        brands ?
          <p>This is a collection of the brands themes you saved.</p>
          : <div>
            <p>Login or Sign up to see your saved brands.</p>
        <div className="upload">
            <Login />
        </div>
          </div>

      }

    </div>
  )
}
export default SavedBrands
