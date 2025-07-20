import React, { useEffect, useState } from "react"
import "../components/css/savedBrand.css"
import Login from "../components/login";
import { useAuth } from "../authContext";
import { fetchBrands } from "../services/brands";
import { TypeOutline,Palette } from "lucide-react";
const SavedBrands = () => {
  const { user, token } = useAuth()
  const [data, setData] = useState(null)
  const fetch = async () => {
    let res = await fetchBrands(token)
    console.log('while fetching', res)
    if (res.statusText === 'OK') {
      console.log(res.data, 'lala')
      setData(res.data)
    }

  }
  useEffect(() => {
    if (token) {
      fetch()
    }
  }, [token])
  return (
    <div className="container">
      <h3 className="page-title">{user?user.email.split('@')[0]+"'s":"Your"} Creation</h3>
      {
        token ?
          <>
            {data ?
              <div>
                <p>This is a collection of the brands themes you created.</p>
                <div className="brands">
                  {data.map((brand) =>
                    <div key={brand.id}>
                      <div className="brand-card" style={{backgroundColor:brand.colors[0]+"1A"}}>
                        <div className="flex-row" >
                          <img className="brand-card-logo" alt="logo"
                            src={brand.logo_url}
                          />
                          <h3>{brand.name}</h3>
                        </div>

                        <div className="flex-col gap-sm">
                          <div className="brand-card-ttl flex-row">
                            <Palette className="icon" />
                            <span>Colors</span></div>
                          <div className="color-list">
                            {brand.colors.map((color) =>
                              <>
                              <div className="color w-sm" style={{backgroundColor:color}}></div>

                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex-col gap-sm">
                          <div className="brand-card-ttl flex-row">
                            <TypeOutline className="icon" />

                            <span>     Typography</span></div>
                          <div className="font-lists">
                            {brand.fonts.map((font) =>
                              <div className="font-container">
                              <span>{font}</span>
                              </div>
                            )}
                          </div>

                        </div>

                      </div>

                    </div>

                  )}
                </div>
              </div> :
              <div>
                <p>No saved brands yet, create one!</p>
              </div>
            }
          </>
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
