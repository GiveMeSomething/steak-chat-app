import React, {
    FunctionComponent,
    MouseEventHandler,
    useEffect,
    useState
} from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import {
    ChannelInfo,
    selectCurrentChannel,
    setIsDirectChannel
} from 'components/server/redux/channels/channels.slice'
import { setCurrentChannel } from 'components/server/redux/channels/channels.thunk'

import { Accordion, Icon } from 'semantic-ui-react'

import AddNewChannelButton from './AddNewChannelButton'
import DropdownItem from './DropdownItem'

interface DropdownLayoutProps {
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
    onAddClick?: MouseEventHandler<HTMLDivElement>
    haveAddNewOption: boolean
    haveContextMenu: boolean
    label: string
    starred: boolean
    listItems?: ChannelInfo[]
}

export const getDropdownStyle = (condition: boolean): string => {
    return condition
        ? 'sidebar-dropdown-item__active'
        : 'sidebar-dropdown-item__inactive'
}

const DropdownLayout: FunctionComponent<DropdownLayoutProps> = ({
    isActive,
    setActive,
    onAddClick,
    haveAddNewOption,
    label,
    starred,
    listItems,
    children
}) => {
    const [selectedChannel, setSelectedChannel] = useState<ChannelInfo>()

    const currentChannel = useAppSelector(selectCurrentChannel)

    useEffect(() => {
        setSelectedChannel(currentChannel)
    }, [])

    const dispatch = useAppDispatch()

    // Handle on dropdown click
    const handleToggleDropdown = () => {
        setActive(!isActive)
    }

    // Select current channel
    const handleSelectChannel = async (channelInfo: ChannelInfo) => {
        dispatch(setIsDirectChannel(false))
        await dispatch(setCurrentChannel(channelInfo))
    }

    const handleOpenChannelMenu = (channel: ChannelInfo) => {
        setSelectedChannel(channel)
    }

    const handleCloseChannelMenu = () => {
        setSelectedChannel(undefined)
    }

    return (
        <Accordion>
            <Accordion.Title active={isActive} onClick={handleToggleDropdown}>
                <div className="flex h-full items-center justify-between px-4 hover:bg-slack-sidebar-hover text-white">
                    <div className="flex items-baseline">
                        <Icon name="dropdown" />
                        <h4>{label}</h4>
                    </div>
                    {haveAddNewOption && (
                        <AddNewChannelButton onAddClick={onAddClick} />
                    )}
                </div>
            </Accordion.Title>
            <Accordion.Content active={isActive}>
                {
                    // Render based on children if existed, else render based on listItems
                    children ||
                        (listItems &&
                            Object.values(listItems).map((channel) => {
                                return (
                                    <DropdownItem
                                        key={channel.id}
                                        channel={channel}
                                        isStarred={starred}
                                        selectedChannel={selectedChannel}
                                        selectChannel={handleSelectChannel}
                                        openMenu={handleOpenChannelMenu}
                                        closeMenu={handleCloseChannelMenu}
                                    />
                                )
                            }))
                }
            </Accordion.Content>
        </Accordion>
    )
}

export default DropdownLayout
