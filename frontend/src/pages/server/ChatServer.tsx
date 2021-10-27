import withAuthRedirect from 'components/middleware/withAuthRedirect'
import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router'
import ServerLayout from './components/ServerLayout'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = () => {
    const { id } = useParams<{ id: string }>()

    console.log('Server ID: ' + id)

    return <ServerLayout />
}

export default withAuthRedirect(ChatServer)
