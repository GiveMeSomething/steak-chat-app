import React, { FunctionComponent } from 'react'

interface MessagesHeaderProps {}

const MessagesHeader: FunctionComponent<MessagesHeaderProps> = () => {
    return (
        <div className="flex items-center justify-between px-4 py-3 w-full border-b-2">
            <div className="flex items-center justify-start h-full">
                <h3 className="font-bold"># ServerName</h3>
                <h5 className="mx-4">Server Topic</h5>
            </div>
            <div className="px-2">Avatar</div>
        </div>
    )
}

export default MessagesHeader
