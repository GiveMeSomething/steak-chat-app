import React, { FunctionComponent, MouseEventHandler } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectChannels } from '../../slices/channel.slice'

import ChannelDropdownLayout from './ChannelDropdownLayout'

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
    const channels = useAppSelector(selectChannels)

    return (
        <ChannelDropdownLayout
            haveAddNewOption={true}
            isActive={isActive}
            label="Channels"
            listItems={channels}
            setActive={setActive}
            starred={false}
            onAddClick={onAddClick}
        />
    )
}

export default ChannelsDropdown
