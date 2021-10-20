import React, { FunctionComponent } from 'react'
import { useParams } from 'react-router'
import ServerLayout from './components/ServerLayout'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = (
    props: ChatServerProps,
) => {
    const { id } = useParams<{ id: string }>()

    console.log(id)

    return <ServerLayout />
}

export default ChatServer
