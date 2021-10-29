import React, { FunctionComponent } from 'react'

interface MessageComponentProps {
    content?: string
    timestamp?: object
    createdBy: {
        username?: string
        photoUrl?: string
    }
}

const MessageComponent: FunctionComponent<MessageComponentProps> = ({
    content,
    timestamp,
    createdBy,
}) => {
    // Firebase save timestamp as object, but still number when console log
    // So we need to manually cast to number
    const serverTime = timestamp as unknown as number

    // Get time from timestamp
    const messageTime = new Date(serverTime).toLocaleString([], {
        hour: '2-digit',
        minute: '2-digit',
    })

    return (
        <div className="flex items-center justify-start py-2 text-gray-500">
            <span className="flex">
                <img
                    src={createdBy.photoUrl}
                    alt="avt"
                    className="rounded-md h-12 w-12"
                />
            </span>
            <div className="ml-4">
                <div className="flex items-baseline pb-1">
                    <h3 className="font-bold">{createdBy.username}</h3>
                    <h5 className="text-slack-text-blur px-2">{messageTime}</h5>
                </div>
                <h5>{content}</h5>
            </div>
        </div>
    )
}

export default MessageComponent
