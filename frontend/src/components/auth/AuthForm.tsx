import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormInput from './FormInput'
import { useRouter } from 'next/dist/client/router'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import {
    logInAndSaveUser,
    removeUserError,
    selectCurrentUser,
    signUpAndSaveUser,
} from './user.slice'

interface AuthFormProps {
    label: string
    action: 'login' | 'signup'
}

interface FormValues {
    email: string
    password: string
}

const AuthForm: FunctionComponent<AuthFormProps> = (props: AuthFormProps) => {
    const [requestError, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    // react-hook-form setup
    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
    } = useForm<FormValues>()

    const router = useRouter()
    const currentUser = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()

    // Redirect if user have already logged in
    useEffect(() => {
        if (currentUser.user) {
            router.push('/')
        }
    }, [])

    // Set focus to input onload
    useEffect(() => setFocus('email'), [])

    async function onSubmit(data: FormValues) {
        // Diable login/signup button
        setIsLoading(true)

        let user
        // Run handle submit based on props.action passed from parents
        try {
            if (props.action === 'signup') {
                user = await dispatch(signUpAndSaveUser(data)).unwrap()
            } else {
                user = await dispatch(logInAndSaveUser(data)).unwrap()
            }

            // Redirect to home after register(auto login) or login
            if (user) {
                // Remove last user-related error (wrong-password, user-not-found, etc...)
                dispatch(removeUserError)
                router.push('/')
            }
        } catch (error: any) {
            // If not Firebase Authentication Error => assume it's network issue
            if (error && error.code) {
                setError('Wrong email and password combination!')
            } else {
                setError('Service unavailable. Please try again later')
            }
        } finally {
            // Enable the login/signup button
            setIsLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center justify-center w-full min-h-full"
        >
            <div className="flex justify-center items-center">
                <h1 className="text-4xl uppercase">{props.label}</h1>
            </div>
            <div className="container text-xl m-2 flex flex-col items-start justify-start">
                <div className="bg-white w-full h-full">
                    <div className="flex flex-col items-start justify-start p-2 w-full">
                        <FormInput
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^@]+@[^@]+\.[^@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            label="email"
                            type="text"
                        />
                        {errors.email && (
                            <p className="text-red-600 font-light text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col items-start justify-start p-2 w-full">
                        <FormInput
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Password should be at least 6 characters',
                                },
                            })}
                            label="password"
                            type="password"
                        />
                        {errors.password && (
                            <p className="text-red-600 font-light text-sm">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col items-center justify-center w-full mt-8">
                        <button
                            type="submit"
                            className="px-10 py-2 rounded-full uppercase text-white bg-fresh-2-500 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {props.label}
                        </button>
                        {requestError && (
                            <p className="text-red-600 font-light text-sm p-2">
                                {requestError}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AuthForm
