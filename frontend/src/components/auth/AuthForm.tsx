import React, { FunctionComponent, useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from 'redux/hooks'

import { firebaseApp } from 'firebase/firebase'
import { getAuth, onAuthStateChanged } from '@firebase/auth'

import { removeUserError } from './redux/auth.slice'
import { signup, signin } from './redux/auth.thunk'

import DescMessage from 'components/commons/formDescription/DescMessage'
import FormInput from './FormInput'

interface AuthFormProps {
    label: string
    submitLabel: string
    action: 'signin' | 'signup'
}

interface FormValues {
    email: string
    password: string
}

const AuthForm: FunctionComponent<AuthFormProps> = (props: AuthFormProps) => {
    const [willBeRedirect, setWillBeDirect] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [requestError, setError] = useState<string>('')

    // react-hook-form setup
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors }
    } = useForm<FormValues>()

    const dispatch = useAppDispatch()

    const auth = getAuth(firebaseApp)

    // Set focus to input onload
    useEffect(() => {
        // Listen to auth changed to redirect to servers page
        setFocus('email')

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setWillBeDirect(true)
            }
        })

        return () => unsubscribe()
    }, [])

    const onSubmit = async (data: FormValues) => {
        // Diable Signin/signup button
        setIsLoading(true)

        // Run handle submit based on props.action passed from parents
        try {
            let user
            if (props.action === 'signup') {
                user = await dispatch(signup(data)).unwrap()
            } else {
                user = await dispatch(signin(data)).unwrap()
            }

            if (user) {
                // Remove last user-related error (wrong-password, user-not-found, etc...)
                dispatch(removeUserError)
            }
        } catch (error: any) {
            // If not Firebase Authentication Error => assume it's network issue
            if (error.message) {
                setError(error.message)
            } else {
                setError('Service unavailable. Please try again later')
            }
        } finally {
            // Enable the Signin/signup button
            setIsLoading(false)
        }
    }

    if (willBeRedirect) {
        return <Redirect to="/servers" />
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center w-full min-h-full"
        >
            <div className="flex justify-center items-center">
                <h1 className="text-6xl lg:text-9xl capitalize">
                    {props.label}
                </h1>
            </div>
            <div className="container text-xl m-2 flex flex-col items-start justify-start">
                <div className="bg-white w-full h-full">
                    <div className="flex flex-col items-start justify-start p-2 w-full">
                        <FormInput
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^@]+@[^@]+\.[^@]+$/,
                                    message: 'Invalid email address'
                                }
                            })}
                            label="email"
                            type="text"
                        />
                        {errors.email && (
                            <DescMessage error message={errors.email.message} />
                        )}
                    </div>
                    <div className="flex flex-col items-start justify-start p-2 w-full">
                        <FormInput
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Password should be at least 6 characters'
                                }
                            })}
                            label="password"
                            type="password"
                        />
                        {errors.password && (
                            <DescMessage
                                error
                                message={errors.password.message}
                            />
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center w-full mt-8">
                        <button
                            type="submit"
                            className="px-10 py-2 rounded-full uppercase text-white bg-fresh-2-500 hover:bg-yellow-700 cursor-pointer disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {props.submitLabel}
                        </button>
                        {requestError && (
                            <DescMessage error message={requestError} />
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AuthForm
