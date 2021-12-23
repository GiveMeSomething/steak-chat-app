import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { selectChannelUsers } from 'components/server/redux/users/users.slice'
import {
    setChannelDetailStartIndex,
    setCurrentMetaPanelData,
    setMetaPanelOpen
} from 'components/server/metaPanel/redux/metaPanel.slice'
import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'

import { isEmpty } from 'lodash'
import { Popup } from 'semantic-ui-react'

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

    const handleOnAvatarStackClick = () => {
        dispatch(setCurrentMetaPanelData(currentChannel))
        dispatch(setChannelDetailStartIndex('members'))
        dispatch(setMetaPanelOpen(true))
    }

    if (!isEmpty(channelUsers)) {
        return (
            <div
                className="border-slack-navbar border-2 flex items-center justify-center rounded-md p-1 cursor-pointer hover:text-gray-800"
                onClick={handleOnAvatarStackClick}
            >
                <div className="grid grid-cols-5">
                    {
                        // Render the avatar of the first 3
                        channelUsers.slice(0, 3).map((user, index) => (
                            <div
                                style={avatarStyle(index)}
                                key={user.uid}
                                data-content={user.username}
                            >
                                <Popup
                                    trigger={
                                        <img
                                            src={user.photoUrl}
                                            className="max-h-6 w-6 rounded-md"
                                        />
                                    }
                                    position="bottom right"
                                >
                                    <Popup.Content>
                                        {user.username}
                                    </Popup.Content>
                                </Popup>
                            </div>
                        ))
                    }
                </div>
                <div className="text-md px-2 text-gray-400">
                    {channelUsers.length}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default AvatarStack
