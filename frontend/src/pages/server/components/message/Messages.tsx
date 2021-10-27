import React, { FunctionComponent } from 'react'
import MessagesHeader from './MessagesHeader'
import MessagesInput from './MessagesInput'
import MessagesPanel from './MessagesPanel'

interface MessagesProps {}

const Messages: FunctionComponent<MessagesProps> = () => {
    return (
        <div className="flex flex-col h-full relative">
            <div className="">
                <MessagesHeader />
            </div>
            <div className="lg:h-5/6 md:h-4/5">
                <MessagesPanel />
            </div>
            <div className="absolute bottom-10 w-full">
                <MessagesInput />
            </div>
        </div>
    )
}

export default Messages
