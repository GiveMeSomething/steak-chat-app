import React from 'react'
import { Link } from 'react-router-dom'

import AuthForm from 'components/auth/AuthForm'

const Signup = () => {
    return (
        <div className="h-screen max-h-screen">
            <div className="grid md:w-1/2 sm:w-full h-full mx-auto">
                <div className="row-span-1">
                    <AuthForm
                        label="🥩"
                        submitLabel="Sign up"
                        action="signup"
                    />
                </div>
                <div className="flex flex-col items-center justify-center border-t-2 row-span-1 py-4 my-4">
                    <h4 className="font-bold">Have an account?</h4>
                    <div className="flex items-center justify-center w-full mt-8 text-xl">
                        <div className="px-10 py-2 rounded-full capitalize text-white bg-fresh-2-500 hover:bg-yellow-700 cursor-pointer">
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
    )
}

export default Signup
