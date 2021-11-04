import React, { FunctionComponent, useRef } from 'react'
import { getDateString, getTimeString } from 'utils/timeUtil'

interface MessageComponentProps {
    content?: string
    timestamp?: object
    media?: string
    createdBy: {
        uid?: string
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
    const imageRef = useRef<HTMLImageElement>(null)

    // Firebase save timestamp as object, but still number when console log
    // So we need to manually cast to number
    const serverTime = timestamp as unknown as number

    const messageTime = `${getDateString(serverTime)}${getTimeString(
        serverTime,
    )}`

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
                <div className="flex items-baseline pb-1">
                    <h3 className="font-bold">{createdBy.username}</h3>
                    <h5 className="text-slack-text-blur px-2">{messageTime}</h5>
                </div>
                {content && <h5 className="text-lg">{content}</h5>}
                {media && (
                    <img src={media} className="max-h-40 p-2" ref={imageRef} />
                )}
            </div>
        </div>
    )
}

export default MessageComponent
