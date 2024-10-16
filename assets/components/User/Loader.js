import React from 'react'
import "./Common.css";
export default function Loader() {
  return (
      <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
          </div>
      </div>
  )
}
