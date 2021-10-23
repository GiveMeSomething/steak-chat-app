import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
// import { useAppSelector } from 'redux/hooks'
// import { selectCurrentUser } from 'pages/auth/components/user.slice'
import { getAuth } from 'firebase/auth'
import { firebaseApp } from 'firebase/firebase'
import { useAppDispatch } from 'redux/hooks'
import { fetchUser } from 'pages/auth/components/user.slice'
import { removeChannels } from 'pages/server/components/channel.slice'

// This will redirect to login page if there are no signed in user
// Wrap this outside of need-to-authenticate components
const withAuthRedirect = (WrappedComponent: any) => (props: any) => {
    const WithAuthRedirect = (props: any) => {
        const [needToRedirect, setNeed] = useState(false)
        const [isLoading, setLoading] = useState(true)
        const dispatch = useAppDispatch()
        // const user = useAppSelector(selectCurrentUser)

        useEffect(() => {
            const auth = getAuth(firebaseApp)

            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (!user) {
                    setNeed(true)
                } else {
                    const uid = user.uid
                    fetchUserInfo(uid)
                }
            })

            dispatch(removeChannels())

            return () => unsubscribe()
        }, [])

        const fetchUserInfo = async (uid: string) => {
            await dispatch(fetchUser({ uid }))
            setLoading(false)
        }

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
