import React, { FunctionComponent } from 'react'

interface MessagesHeaderProps {}

const MessagesHeader: FunctionComponent<MessagesHeaderProps> = () => {
    return (
        <div className="flex items-center justify-between px-2 w-full">
            <div className="flex items-center justify-start">
                <div>
                    <h2>#server-name</h2>
                </div>
                <div>
                    <h3 className="text-slack-text-blur">Server topic</h3>
                </div>
            </div>
            <div className="px-2">Avatar</div>
        </div>
    )
}

export default MessagesHeader
