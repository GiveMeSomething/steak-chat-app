import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectStarredChannels } from 'components/server/redux/channels/channels.slice'

import DropdownLayout from '../layout/DropdownLayout'

interface StarredDropdownProps {
    isActive: boolean
    setActive: React.Dispatch<React.SetStateAction<boolean>>
}

const StarredDropdown: FunctionComponent<StarredDropdownProps> = ({
    isActive,
    setActive
}) => {
    const starredChannel = useAppSelector(selectStarredChannels)

    return (
        <DropdownLayout
            isActive={isActive}
            setActive={setActive}
            haveAddNewOption={false}
            haveContextMenu={true}
            label="Starred"
            listItems={starredChannel}
            starred={true}
        />
    )
}

export default StarredDropdown
