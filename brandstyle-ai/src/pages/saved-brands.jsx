import React, { useEffect, useState } from "react"
import "../components/css/savedBrand.css"
import Login from "../components/login";
import { useAuth } from "../authContext";
import { fetchBrands } from "../services/brands";
import { TypeOutline, RefreshCcw, Palette, Trash } from "lucide-react";
import { deleteBrand } from "../services/brands";
import toast from "react-hot-toast";
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
  const deleteTheBrand = async (index, token) => {
    let res = await deleteBrand(index, token)
    return res
  }
  const removeBrand = async (index, name) => {
    console.log(index, 'to delete')
    toast((t) => (
      <div>
        <div>Are you sure you want to delete this brand {name}?</div>
        <div className="flex-row gap-sm">
          <button onClick={() => { toast.dismiss(t.id) }}>
            Cancel
          </button>

          <button onClick={async () => {
            let res = await deleteTheBrand(index, token)
            console.log(res)
            if (res.status == 204) {
              toast.success('Successfully delete the brand')
              fetch()
            }
            else {
              toast.error("Could'nt delete the brand")
            }
            toast.dismiss(t.id)
          }}>
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 4000,
    });

  }
  useEffect(() => {
    if (token) {
      fetch()
    }
  }, [token])
  return (
    <div className="container">
      <h3 className="page-title">{user ? user.email.split('@')[0] + "'s" : "Your"} Creation</h3>
      {
        token ?
          <>
            {data ?
              <div>
              <div className="flex-row gap-sm">
                <p>This is a collection of the brands themes you created.</p>
                <div
              onClick={fetch}
              className="margin-auto-l iconBtn"
              >
                  <RefreshCcw  className="icon"/>
                </div>
              </div>
                <div className="brands">
                  {data.map((brand) =>
                    <div key={brand.id}>
                      <div className="brand-card" style={{ backgroundColor: brand.colors[0] + "1A" }}>
                        <div className="flex-row" >
                          <img className="brand-card-logo" alt="logo"
                            src={brand.logo_url}
                          />
                          <h3>{brand.name}</h3>
                          <div onClick={() => removeBrand(brand.id, brand.name)} className="trash-container">
                            <Trash className="icon" />
                          </div>
                        </div>

                        <div className="flex-col gap-sm">
                          <div className="brand-card-ttl flex-row">
                            <Palette className="icon" />
                            <span>Colors</span></div>
                          <div className="color-list">
                            {brand.colors.map((color, e) =>
                              <>
                                <div key={e} className="color w-sm" style={{ backgroundColor: color }}></div>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex-col gap-sm">
                          <div className="brand-card-ttl flex-row">
                            <TypeOutline className="icon" />
                            <span> Typography</span></div>
                          <div className="font-lists">
                            {brand.fonts.map((font, e) =>
                              <div key={e} className="font-container">
                                <span >{font}</span>
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
