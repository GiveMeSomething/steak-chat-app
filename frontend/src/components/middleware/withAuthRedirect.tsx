import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
// import { useAppSelector } from 'redux/hooks'
// import { selectCurrentUser } from 'pages/auth/components/user.slice'
import { useAppDispatch } from 'redux/hooks'
import { removeChannels } from 'pages/server/components/channel.slice'
import { getAuth } from '@firebase/auth'
import { firebaseApp } from 'firebase/firebase'
import { fetchUser } from 'pages/auth/components/user.slice'

// This will redirect to login page if there are no signed in user
// Wrap this outside of need-to-authenticate components
const withAuthRedirect = (WrappedComponent: any) => (props: any) => {
    const WithAuthRedirect = (props: any) => {
        const [needToRedirect, setNeedToRedirect] = useState(false)
        const [isLoading, setIsLoading] = useState(true)
        const dispatch = useAppDispatch()

        const auth = getAuth(firebaseApp)

        const fetchUserInfo = async () => {
            await dispatch(fetchUser())
            setIsLoading(false)
        }

        useEffect(() => {
            setIsLoading(true)

            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (!user) {
                    setNeedToRedirect(true)
                } else {
                    fetchUserInfo()
                }
            })

            dispatch(removeChannels())

            return () => unsubscribe()
        }, [])

        if (needToRedirect) {
            return (
                <Redirect
                    to={{
                        pathname: '/auth/signin',
                        state: { from: 'From Chat Server' },
                    }}
                />
            )
        } else {
            if (isLoading) {
                return (
                    <div className="h-screen w-screen max-h-screen flex items-center justify-center">
                        <div className="ui active inverted dimmer">
                            <div className="ui text loader">Loading</div>
                        </div>
                    </div>
                )
            } else {
                return <WrappedComponent {...props} />
            }
        }
    }

    return <WithAuthRedirect {...props} />
}

export default withAuthRedirect
