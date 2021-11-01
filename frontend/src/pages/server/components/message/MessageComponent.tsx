import React, { FunctionComponent } from 'react'

interface MessageComponentProps {
    content?: string
    timestamp?: object
    media?: string
    createdBy: {
        username?: string
        photoUrl?: string
    }
}

const MessageComponent: FunctionComponent<MessageComponentProps> = ({
    content,
    timestamp,
    createdBy,
    media,
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
        <div className="flex items-start justify-start py-2 text-gray-500">
            <span className="flex items-start">
                <img
                    src={createdBy.photoUrl}
                    alt="avt"
                    className="rounded-md h-12 w-12"
                />
            </span>
            <div className="ml-4">
                <div className="flex items-center h-full text-xl">
                    <h4 className="font-semibold text-xl leading-none">
                        {createdBy.username}
                    </h4>
                    <p className="text-slack-text-blur text-sm leading-none px-2">
                        {messageTime}
                    </p>
                </div>
                {content && <h5 className="text-lg">{content}</h5>}
                {media && <img src={media} className="max-h-40 p-2" />}
            </div>
        </div>
    )
}

export default MessageComponent
