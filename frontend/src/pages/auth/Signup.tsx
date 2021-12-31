import React from 'react'
import { Link } from 'react-router-dom'
import AuthForm from 'components/auth/AuthForm'

const Signup = () => {
    return (
        <div className="h-screen max-h-screen">
            <div className="grid md:w-1/2 sm:w-full h-full mx-auto">
                <AuthForm
                    label="🥩"
                    submitButtonLabel="Sign in"
                    action="signin"
                />
                <div className="flex flex-col items-center justify-center my-8 border-t-2">
                    <h2 className="font-semibold">Have an account?</h2>
                    <div className="flex items-center justify-center w-full mt-8">
                        <div className="px-10 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer">
                            <Link
                                to="/auth/signin"
                                className="text-white uppercase text-xl"
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
