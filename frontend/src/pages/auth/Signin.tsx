import React from 'react'
import { Link } from 'react-router-dom'
import AuthForm from 'components/auth/AuthForm'

const Signin = () => {
    return (
        <div className="h-screen max-h-screen">
            <div className="grid md:w-1/2 sm:w-full h-full mx-auto">
                <div className="row-span-1">
                    <AuthForm
                        label="🥩"
                        submitLabel="Sign in"
                        action="signin"
                    />
                </div>
                <div className="flex flex-col items-center justify-center border-t-2 row-span-1 py-4 my-4">
                    <h4 className="font-bold">Don&apos;t have an account?</h4>
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
    )
}

export default Signin
