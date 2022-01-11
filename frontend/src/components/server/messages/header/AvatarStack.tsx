import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { selectChannelUsers } from 'components/server/redux/users/users.slice'
import {
    setChannelDetailStartIndex,
    setCurrentMetaPanelData,
    setMetaPanelOpen
} from 'components/server/metaPanel/redux/metaPanel.slice'
import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'

import AvatarPopup from './AvatarPopup'

interface AvatarStackProps {}

const AvatarStack: FunctionComponent<AvatarStackProps> = () => {
    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)
    const channelUsers = useAppSelector(selectChannelUsers)

    // Styles to make images overlap each other
    const avatarStyle = (index: number): React.CSSProperties => ({
        gridColumn: `${1 + index}/${3 + index}`,
        gridRow: '1 / 2',
        zIndex: 3 - index
    })

    // Open 'Members' tab in MetaPanel
    const handleOnAvatarStackClick = () => {
        dispatch(setCurrentMetaPanelData(currentChannel))
        dispatch(setChannelDetailStartIndex('members'))
        dispatch(setMetaPanelOpen(true))
    }

    return (
        <div
            className="border-slack-navbar border-2 flex flex-center rounded-md p-1 cursor-pointer hover:text-gray-800"
            onClick={handleOnAvatarStackClick}
        >
            <div className="grid grid-cols-5">
                {
                    // Render the avatar of the first 3
                    channelUsers
                        .slice(0, 3)
                        .map(({ uid, username, photoUrl }, index) => (
                            <div
                                style={avatarStyle(index)}
                                key={uid}
                                data-content={username}
                            >
                                <AvatarPopup
                                    photoUrl={photoUrl}
                                    popupContent={username}
                                />
                            </div>
                        ))
                }
            </div>
            <div className="text-md px-2 text-gray-400">
                {channelUsers.length}
            </div>
        </div>
    )
}

export default AvatarStack
