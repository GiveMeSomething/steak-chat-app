import React, { FunctionComponent } from 'react'
import MessagesHeader from './MessagesHeader'
import MessagesInput from './MessagesInput'
import MessagesPanel from './MessagesPanel'

interface MessagesProps {}

const Messages: FunctionComponent<MessagesProps> = () => {
    return (
        <div>
            <MessagesHeader />
            <MessagesPanel />
            <MessagesInput />
        </div>
    )
}

export default Messages
