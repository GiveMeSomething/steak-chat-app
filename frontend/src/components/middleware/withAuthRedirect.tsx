import React, { FunctionComponent, useEffect, useState } from 'react'
import { Redirect } from 'react-router'
// import { useAppSelector } from 'redux/hooks'
// import { selectCurrentUser } from 'pages/auth/components/user.slice'
import { useAppDispatch } from 'redux/hooks'
import { getAuth } from '@firebase/auth'
import { firebaseApp } from 'firebase/firebase'
import { fetchUser } from 'components/auth/redux/auth.slice'

// This will redirect to login page if there are no signed in user
// Wrap this outside of need-to-authenticate components
function withAuthRedirect<PropsType>(
    WrappedComponent: FunctionComponent<PropsType>,
) {
    return (props: PropsType) => {
        const [needToRedirect, setNeedToRedirect] = useState<boolean>(false)
        const [isLoading, setIsLoading] = useState<boolean>(true)

        const dispatch = useAppDispatch()

        const auth = getAuth(firebaseApp)

        const fetchUserInfo = async () => {
            // The page will wait for fetchUser to finish before display anything
            setIsLoading(true)

            await dispatch(fetchUser())

            setIsLoading(false)
        }

        useEffect(() => {
            const unsubscribe = auth.onAuthStateChanged((user) => {
                if (!user) {
                    setNeedToRedirect(true)
                } else {
                    fetchUserInfo()
                }
            })

            return () => unsubscribe()
        }, [])

        // Redirect based on authState
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
}

export default withAuthRedirect
