import React from 'react'
import { Link } from 'react-router-dom'
import AuthForm from './components/AuthForm'

const Signup = () => {
    return (
        <div className="h-screen max-h-screen overflow-hidden">
            <div className="grid grid-cols-10 max-h-full">
                <div className="col-span-6">
                    <img
                        src="/image/sub-banner-2.jpg"
                        className="object-contain w-full h-auto"
                    />
                </div>
                <div className="col-span-4 grid m-2 h-screen">
                    <div className="row-span-2">
                        <AuthForm label="Sign up" action="signup" />
                    </div>
                    <div className="flex flex-col items-center justify-center border-t-2 w-4/5 mx-auto row-span-1">
                        <h4 className="font-bold">Have an account?</h4>
                        <div className="flex items-center justify-center w-full mt-8 text-xl">
                            <div className="px-10 py-2 rounded-full uppercase text-white bg-fresh-2-500 hover:bg-yellow-700 cursor-pointer">
                                <Link
                                    to="/auth/signin"
                                    className="no-underline uppercase hover:text-white"
                                >
                                    Sign in
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
