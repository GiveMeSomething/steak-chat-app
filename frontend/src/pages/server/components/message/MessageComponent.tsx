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
    const getMessageTime = () =>
        new Date(serverTime).toLocaleString([], {
            hour: '2-digit',
            minute: '2-digit',
        })

    const getMessageDateString = () => {
        const currentTime = new Date()
        const messageTime = new Date(serverTime)

        const diffDay = currentTime.getDate() - messageTime.getDate()
        const diffMonth = currentTime.getMonth() - messageTime.getMonth()
        const diffYear = currentTime.getFullYear() - messageTime.getFullYear()

        if (diffDay === 0 && diffMonth === 0 && diffYear === 0) {
            return 'Today at '
        } else if (diffDay === 1 && diffMonth === 0 && diffYear === 0) {
            return 'Yesterday at '
        } else {
            return `${messageTime.getDate()}/${messageTime.getMonth()}/${messageTime.getFullYear()} at `
        }
    }

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
                    <h5 className="text-slack-text-blur px-2">{`${getMessageDateString()}${getMessageTime()}`}</h5>
                </div>
                <h5>{content}</h5>
            </div>
        </div>
    )
}

export default MessageComponent
