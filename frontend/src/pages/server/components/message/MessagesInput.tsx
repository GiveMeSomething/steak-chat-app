import React, { FunctionComponent } from 'react'

interface MessagesInputProps {}

const MessagesInput: FunctionComponent<MessagesInputProps> = () => {
    return (
        <div className="flex px-2 pb-2 items-start justify-center w-full absolute">
            <input placeholder="Message #name" className="w-full" />
        </div>
    )
}

export default MessagesInput
