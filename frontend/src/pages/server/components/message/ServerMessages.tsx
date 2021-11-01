import React, { FunctionComponent } from 'react'
import MessagesHeader from './MessagesHeader'
import MessagesInput from './MessagesInput'
import MessagesPanel from './MessagesPanel'

interface ServerMessagesProps {}

const ServerMessages: FunctionComponent<ServerMessagesProps> = () => {
    return (
        <div className="flex flex-col h-full relative">
            <div className="">
                <MessagesHeader />
            </div>
            <MessagesPanel />
            <div className="absolute -bottom-0 w-full bg-white z-10">
                <MessagesInput />
            </div>
        </div>
    )
}

export default ServerMessages
