import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import FormInput from './FormInput'
import { firebaseApp, database } from '@firebase/firebase'
import md5 from 'md5'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    getAuth,
    updateProfile,
    Auth,
    User,
} from 'firebase/auth'
import { ref, set } from '@firebase/database'
interface AuthFormProps {
    label: string
    action: 'login' | 'signup'
}

type FormValues = {
    userEmail: string
    userPassword: string
}

const AuthForm: FunctionComponent<AuthFormProps> = (props: AuthFormProps) => {
    const [requestError, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        setFocus,
        formState: { errors },
    } = useForm<FormValues>()

    useEffect(() => setFocus('userEmail'), [])

    async function updateUserToDatabase(createdUser: User) {
        await set(ref(database, 'users/' + createdUser.uid), {
            username: createdUser.displayName,
            email: createdUser.email,
            photoUrl: createdUser.photoURL,
        })
    }

    async function signUp(auth: Auth, data: FormValues) {
        try {
            await createUserWithEmailAndPassword(
                auth,
                data.userEmail,
                data.userPassword,
            )

            // Log the user for ease of development, will be deleted later
            console.log(auth.currentUser)

            if (auth.currentUser) {
                await updateProfile(auth.currentUser, {
                    displayName:
                        auth.currentUser.email?.split('@')[0] ||
                        'defaultUsername',
                    photoURL: `https://gravatar.com/avatar/${md5(
                        auth.currentUser.email,
                    )}?d=identicon`,
                })

                await updateUserToDatabase(auth.currentUser)
            }
        } catch (error: any) {
            console.log(error)
            error.message && setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    async function logIn(auth: Auth, data: FormValues) {
        try {
            const user = await signInWithEmailAndPassword(
                auth,
                data.userEmail,
                data.userPassword,
            )

            console.log(user)
        } catch (error: any) {
            console.log(error)
            error.message && setError(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    async function onSubmit(data: FormValues) {
        setIsLoading(true)

        const auth = getAuth(firebaseApp)
        if (props.action === 'signup') {
            await signUp(auth, data)
        } else {
            await logIn(auth, data)
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
                            {...register('userEmail', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^@]+@[^@]+\.[^@]+$/,
                                    message: 'Invalid email address',
                                },
                            })}
                            label="email"
                            type="text"
                        />
                        {errors.userEmail && (
                            <p className="text-red-600 font-light text-sm">
                                {errors.userEmail.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col items-start justify-start p-2 w-full">
                        <FormInput
                            {...register('userPassword', {
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
                        {errors.userPassword && props.action !== 'login' && (
                            <p className="text-red-600 font-light text-sm">
                                {errors.userPassword.message}
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
