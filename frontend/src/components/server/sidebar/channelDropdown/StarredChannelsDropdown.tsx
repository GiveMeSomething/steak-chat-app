import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectStarredChannels } from '../../redux/channel.slice'
import ChannelDropdownLayout from './ChannelDropdownLayout'

interface StarredChannelsDropdownProps {
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const StarredChannelsDropdown: FunctionComponent<StarredChannelsDropdownProps> =
    ({ isActive, setActive }) => {
        const starredChannel = useAppSelector(selectStarredChannels)

        return (
            <ChannelDropdownLayout
                haveAddNewOption={false}
                isActive={isActive}
                label="Starred"
                listItems={starredChannel}
                setActive={setActive}
                starred={true}
            />
        )
    }

export default StarredChannelsDropdown
