import React from 'react'
import { Link } from 'react-router-dom'
import AuthForm from './components/AuthForm'

const Login = () => {
    return (
        <div className="fullscreen">
            <div className="grid grid-cols-10 h-full">
                <div className="col-span-6 relative">
                    <img
                        className="object-cover"
                        src="/image/sub-banner-1.webp"
                    />
                </div>
                <div className="col-span-4 grid m-2">
                    <div className="row-span-2">
                        <AuthForm label="Log in" action="login" />
                    </div>
                    <div className="flex flex-col items-center justify-center border-t-2 w-4/5 mx-auto row-span-1">
                        <h4 className="font-bold">
                            Don&apos;t have an account?
                        </h4>
                        <div className="flex items-center justify-center w-full mt-8 text-xl">
                            <div className="px-10 py-2 rounded-full uppercase text-white bg-fresh-2-500">
                                <Link to="/auth/signup">Sign up</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
