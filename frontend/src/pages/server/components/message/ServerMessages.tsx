import React, { FunctionComponent, useState } from 'react'
import MessagesHeader from './MessagesHeader'
import MessagesInput from './MessagesInput'
import MessagesPanel from './MessagesPanel'

interface ServerMessagesProps {}

const ServerMessages: FunctionComponent<ServerMessagesProps> = () => {
<<<<<<< HEAD
    const [isAddMediaModalOpen, setAddMediaModalOpen] = useState<boolean>(false)
=======
>>>>>>> 5c00acd (feat: add server name to chat header, remove few redudant props passing, number of user will be skip for now (to find a better way of counting, other than depend on message in a channel to count user))
    return (
        <div className="flex flex-col h-full relative">
            <div className="">
                <MessagesHeader />
            </div>
            <MessagesPanel />
            <div className="absolute -bottom-0 w-full bg-white z-10">
<<<<<<< HEAD
                <MessagesInput
                    isAddMediaModalOpen={isAddMediaModalOpen}
                    setAddMediaModalOpen={setAddMediaModalOpen}
                />
=======
                <MessagesInput />
>>>>>>> 5c00acd (feat: add server name to chat header, remove few redudant props passing, number of user will be skip for now (to find a better way of counting, other than depend on message in a channel to count user))
            </div>
        </div>
    )
}

export default ServerMessages
