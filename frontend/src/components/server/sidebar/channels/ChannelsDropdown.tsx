import React, { FunctionComponent, useState } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectChannels } from 'components/server/redux/channels/channels.slice'

import AddChannelModal from './AddChannelModal'
import ChannelDropdownLayout from '../DropdownLayout'

interface ChannelsDropdownProps {
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const ChannelsDropdown: FunctionComponent<ChannelsDropdownProps> = ({
    isActive,
    setActive
}) => {
    const [isAddChannelModalActive, setIsAddChannelModalActive] =
        useState<boolean>(false)

    const channels = useAppSelector(selectChannels)

    const onAddClick = (event: React.MouseEvent<HTMLDivElement>) => {
        // Stop the event to trigger close channels dropdown
        event.stopPropagation()

        setIsAddChannelModalActive(true)
    }

    return (
        <>
            <ChannelDropdownLayout
                isActive={isActive}
                setActive={setActive}
                haveAddNewOption={true}
                haveContextMenu={true}
                label="Channels"
                listItems={channels}
                starred={false}
                onAddClick={onAddClick}
            />
            <AddChannelModal
                isOpen={isAddChannelModalActive}
                setOpen={setIsAddChannelModalActive}
            />
        </>
    )
}

export default ChannelsDropdown
