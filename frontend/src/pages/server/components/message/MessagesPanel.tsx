import React, { FunctionComponent } from 'react'

interface MessagePanelProps {}

const MessagesPanel: FunctionComponent<MessagePanelProps> = () => {
    return (
        <div className="flex w-full h-full items-center justify-center">
            Message Panel
        </div>
    )
}

export default MessagesPanel
