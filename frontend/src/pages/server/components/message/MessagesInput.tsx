import React, { FunctionComponent } from 'react'
import { Button, Popup } from 'semantic-ui-react'

interface MessagesInputProps {}

const MessagesInput: FunctionComponent<MessagesInputProps> = () => {
    return (
        <div className="flex items-baseline justify-center mb-4 mx-4">
            <Popup
                content="Attach file"
                trigger={<Button basic icon="paperclip" color="blue" />}
            />

            <input
                placeholder="Message #name"
                className="w-full px-4 py-2 rounded-md border-2 border-slack-text-blur"
            />
        </div>
    )
}

export default MessagesInput
