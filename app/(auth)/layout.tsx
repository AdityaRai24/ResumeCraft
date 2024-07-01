import React, { ReactNode } from 'react'

const AuthLayout = ({children} : {children : ReactNode}) => {
  return (
    <div className='flex items-center justify-center w-full h-screen'>
        {children}
    </div>
  )
}

export default AuthLayout