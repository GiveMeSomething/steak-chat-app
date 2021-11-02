import React, { FunctionComponent, useState } from 'react'
import MessagesHeader from './MessagesHeader'
import MessagesInput from './MessagesInput'
import MessagesPanel from './MessagesPanel'

interface ServerMessagesProps {}

const ServerMessages: FunctionComponent<ServerMessagesProps> = () => {
    const [isAddMediaModalOpen, setAddMediaModalOpen] = useState<boolean>(false)
    return (
        <div className="flex flex-col h-full relative">
            <div className="">
                <MessagesHeader />
            </div>
            <MessagesPanel />
            <div className="absolute -bottom-0 w-full bg-white z-10">
                <MessagesInput
                    isAddMediaModalOpen={isAddMediaModalOpen}
                    setAddMediaModalOpen={setAddMediaModalOpen}
                />
            </div>
        </div>
    )
}

export default ServerMessages
