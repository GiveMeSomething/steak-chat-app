import React from 'react'
import { Link } from 'react-router-dom'
import AuthForm from './components/AuthForm'

const Signin = () => {
    return (
        <div className="h-screen max-h-screen overflow-hidden">
            <div className="grid grid-cols-10 max-h-full">
                <div className="col-span-6">
                    <img
                        src="/image/sub-banner-1.webp"
                        className="object-contain w-full h-auto"
                    />
                </div>
                <div className="col-span-4 grid m-2 h-screen">
                    <div className="row-span-2">
                        <AuthForm label="Sign in" action="signin" />
                    </div>
                    <div className="flex flex-col items-center justify-center border-t-2 w-4/5 mx-auto row-span-1">
                        <h4 className="font-bold">
                            Don&apos;t have an account?
                        </h4>
                        <div className="flex items-center justify-center w-full mt-8 text-xl">
                            <div className="px-10 py-2 rounded-full capitalize text-white bg-fresh-2-500 hover:bg-yellow-700 cursor-pointer">
                                <Link
                                    to="/auth/signup"
                                    className="no-underline uppercase hover:text-white"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signin
