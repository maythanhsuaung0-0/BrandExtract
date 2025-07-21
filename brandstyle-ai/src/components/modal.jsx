import React, { useState } from 'react'
import '../components/css/auth.css'
export default function Modal({ isOpen, closeModal,children }) {


  const close= () => {
    closeModal(!isOpen)
    // setFormData({
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    // })
  }

  return (
    <>

      {isOpen && (
        <div className="overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button onClick={close} className="closeButton">
              ×
            </button>

            {children}
          </div>
        </div>
      )}

    </>

  )
}
