import React, { FunctionComponent, MouseEventHandler } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Accordion, Icon, Popup } from 'semantic-ui-react'
import {
    ChannelInfo,
    selectChannels,
    selectCurrentChannel,
    setCurrentChannel,
} from '../slices/channel.slice'

interface ChannelsDropdownProps {
    onAddClick: MouseEventHandler<HTMLDivElement>
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const ChannelsDropdown: FunctionComponent<ChannelsDropdownProps> = ({
    onAddClick,
    isActive,
    setActive,
}) => {
    const dispatch = useAppDispatch()

    const channels = useAppSelector(selectChannels)
    const currentChannel = useAppSelector(selectCurrentChannel)

    // Select current channel
    const handleOnChannelClick = (channelInfo: ChannelInfo) => {
        dispatch(setCurrentChannel(channelInfo))
    }

    const handleOnChannelMenuClick = () => {
        setActive(!isActive)
    }

    return (
        <Accordion>
            <Accordion.Title
                active={isActive}
                onClick={handleOnChannelMenuClick}
            >
                <div className="flex h-full items-center justify-between px-4 hover:bg-slack-sidebar-hover text-white">
                    <div className="flex items-baseline">
                        <Icon name="dropdown" />
                        <h4>Channels</h4>
                    </div>

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
                </div>
            </Accordion.Title>
            <Accordion.Content active={isActive}>
                {Object.values(channels).map((channel) => {
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
                })}
            </Accordion.Content>
        </Accordion>
    )
}

export default ChannelsDropdown
