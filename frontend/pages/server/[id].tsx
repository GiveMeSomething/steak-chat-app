import React, { FunctionComponent } from 'react'
import { useRouter } from 'next/dist/client/router'

import ServerLayout from '@components/server/ServerLayout'

interface ServerPageProps {}

const ServerPage: FunctionComponent<ServerPageProps> = () => {
    const router = useRouter()

    console.log(router.query)

    return <ServerLayout />
}

export default ServerPage
