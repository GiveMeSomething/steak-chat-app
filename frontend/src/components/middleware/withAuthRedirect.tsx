import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useAppSelector } from 'redux/hooks'
import { selectCurrentUser } from 'pages/auth/components/user.slice'

// This will redirect to login page if there are no signed in user
// Wrap this outside of need-to-authenticate components
const withAuthRedirect = (WrappedComponent: any) => (props: any) => {
    const WithAuthRedirect = (props: any) => {
        const [needToRedirect, setNeed] = useState(false)
        const user = useAppSelector(selectCurrentUser)

        useEffect(() => {
            console.log('Need user running')
            if (!user.user) {
                setNeed(true)
            }
        }, [user])

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
            return <WrappedComponent {...props} />
        }
    }

    return <WithAuthRedirect {...props} />
}

export default withAuthRedirect
