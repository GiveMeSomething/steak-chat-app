import React, { FunctionComponent, useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from 'redux/hooks'

import { firebaseApp } from 'firebase/firebase'
import { getAuth, onAuthStateChanged } from '@firebase/auth'

import { removeUserError } from './redux/auth.slice'
import { signup, signin } from './redux/auth.thunk'

import { Undefinable } from 'types/commonType'

import DescMessage from 'components/commons/formDescription/DescMessage'
import FormInput from './FormInput'

interface AuthFormProps {
    label: string
    submitButtonLabel: string
    action: 'signin' | 'signup'
}

interface FormValues {
    email: string
    password: string
}

const AuthForm: FunctionComponent<AuthFormProps> = ({
    label,
    submitButtonLabel,
    action
}) => {
    const [needRedirect, setRedirect] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [requestError, setRequestError] = useState<Undefinable<string>>()

    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors }
    } = useForm<FormValues>()

    const dispatch = useAppDispatch()
    const auth = getAuth(firebaseApp)

    useEffect(() => {
        // Focus on 'email' input onload
        setFocus('email')

        // Listen to auth changed to redirect to servers page
        const unsubscribeAuthStateChanged = onAuthStateChanged(auth, (user) => {
            user && setRedirect(true)
        })

        // Unsubscribe on component unmount
        return () => unsubscribeAuthStateChanged()
    }, [])

    // Dispatch action based on 'action' passed in
    const authenticateUser = async (userCredentials: FormValues) => {
        let currentUser
        if (action === 'signup') {
            currentUser = await dispatch(signup(userCredentials)).unwrap()
        } else {
            currentUser = await dispatch(signin(userCredentials)).unwrap()
        }

        // Remove errors when finish authenticating
        currentUser && dispatch(removeUserError)
    }

    const setMessageByError = (error: any) => {
        // TODO: Maybe build a custom message generator based on FirebaseError
        // If not FirebaseError => assume it's network issue
        if (error.message) {
            setRequestError(error.message)
        } else {
            setRequestError('Service unavailable. Please try again later')
        }
    }

    const onSubmit = async (data: FormValues) => {
        // Disable 'Signin' or 'Signup' button
        setIsLoading(true)

        try {
            await authenticateUser(data)
        } catch (error: any) {
            setMessageByError(error)
        } finally {
            // Enable 'Signin' or 'Signup' button whatever the result
            setIsLoading(false)
        }
    }

    // Use react-router to redirect to 'servers' page when use logged in
    if (needRedirect) {
        return <Redirect to="/servers" />
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex-full flex-center flex-col min-h-full"
        >
            <h1 className="text-6xl lg:text-9xl capitalize">{label}</h1>
            <div className="container my-2">
                <div className="bg-white w-full h-full">
                    <FormInput
                        {...register('email', {
                            required: 'Email is required',
                            pattern: {
                                value: /^[^@]+@[^@]+\.[^@]+$/,
                                message: 'Invalid email address'
                            }
                        })}
                        label="email"
                        inputType="text"
                        className="mt-4"
                    />
                    {errors.email && (
                        <DescMessage
                            error
                            message={errors.email.message}
                            className="px-4 mt-1"
                        />
                    )}

                    <FormInput
                        {...register('password', {
                            required: 'Password is required'
                        })}
                        label="password"
                        inputType="password"
                        className="mt-4"
                    />
                    {errors.password && (
                        <DescMessage
                            error
                            message={errors.password.message}
                            className="px-4 mt-1"
                        />
                    )}

                    {requestError && (
                        <div className="flex justify-center">
                            <DescMessage error message={requestError} />
                        </div>
                    )}
                    <div className="flex-full flex-center mt-8">
                        <button
                            type="submit"
                            className="px-10 py-2 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer disabled:opacity-50"
                            disabled={isLoading}
                        >
                            <div className="uppercase text-white text-xl">
                                {submitButtonLabel}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AuthForm
