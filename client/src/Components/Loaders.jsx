import React from 'react'
import Loading from '../images/loading.gif'

const Loaders = () => {
  return (
    <div className='loader'>
        <div className="loader__image">
          <img src={Loading} alt="" />
        </div>
    </div>
  )
}

export default Loaders
