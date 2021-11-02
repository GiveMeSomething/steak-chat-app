import React, { FunctionComponent } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'

interface UsersDropdownProps {
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const UsersDropdown: FunctionComponent<UsersDropdownProps> = ({
    isActive,
    setActive,
}) => {
    const handleOnUsersMenuClick = () => {
        setActive(!isActive)
    }

    return (
        <Accordion>
            <Accordion.Title active={isActive} onClick={handleOnUsersMenuClick}>
                <div className="flex h-full items-center justify-between px-4 hover:bg-slack-sidebar-hover text-white">
                    <div className="flex items-baseline">
                        <Icon name="dropdown" />
                        <h4>Users</h4>
                    </div>
                </div>
            </Accordion.Title>
            <Accordion.Content active={isActive}>
                {/* {Object.values(users).map((channel) => {
                    return (
                        <div
                            className={`flex items-center justify-between h-full w-full pl-4 cursor-pointer
                                ${
                                    channel.id === currentChannel.id
                                        ? 'bg-slack-sidebar-focus text-slack-text-focus'
                                        : 'hover:bg-slack-sidebar-hover text-slack-text-blur'
                                }`}
                            key={channel.id}
                            onClick={() => handleOnChannelClick(channel)}
                        >
                            <div className="flex items-baseline px-4 py-2">
                                <Icon name="hashtag" className="m-0" />
                                <h4 className="leading-6">{channel.name}</h4>
                            </div>
                            <div className="ml-auto pr-4">
                                <div className="flex items-baseline cursor-pointer">
                                    <Icon name="ellipsis horizontal" />
                                </div>
                            </div>
                        </div>
                    )
                })} */}
            </Accordion.Content>
        </Accordion>
    )
}

export default UsersDropdown
