import React, { FunctionComponent } from 'react'

import MessagesHeader from './header/MessagesHeader'
import MessagesInput from './userInput/MessagesInput'
import MessagesPanel from './MessagesPanel'

interface ServerMessagesProps {}

const ServerMessages: FunctionComponent<ServerMessagesProps> = () => {
    return (
        <div className="flex flex-col h-full relative">
            <div>
                <MessagesHeader />
            </div>
            <MessagesPanel />
            <div className="absolute bottom-0 w-full bg-white z-20">
                <MessagesInput />
            </div>
        </div>
    )
}

export default ServerMessages
