import React, { FunctionComponent, MouseEventHandler } from 'react'
import { Popup } from 'semantic-ui-react'

interface AddNewChannelButtonProps {
    onAddClick?: MouseEventHandler<HTMLDivElement>
}

const AddNewChannelButton: FunctionComponent<AddNewChannelButtonProps> = ({
    onAddClick
}) => {
    return (
        <Popup
            content="Add new channel"
            trigger={
                <div
                    className="flex items-baseline justify-center hover:bg-slack-sidebar-focus leading-6 align-middle px-2 rounded-md cursor-pointer"
                    onClick={onAddClick}
                >
                    <h3>+</h3>
                </div>
            }
        />
    )
}

export default AddNewChannelButton
