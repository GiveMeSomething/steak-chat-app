import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectChannelUsers } from 'components/server/redux/users/users.slice'

import { isEmpty } from 'lodash'
import { Popup } from 'semantic-ui-react'

interface AvatarStackProps {}

const AvatarStack: FunctionComponent<AvatarStackProps> = () => {
    const channelUsers = useAppSelector(selectChannelUsers)

    // Styles to make images overlap each other
    const avatarStyle = (index: number): React.CSSProperties => ({
        gridColumn: `${1 + index}/${3 + index}`,
        gridRow: '1 / 2',
        zIndex: 3 - index
    })

    if (!isEmpty(channelUsers)) {
        return (
            <div className="border-slack-navbar border-2 flex items-center justify-center rounded-md p-1">
                <div className="grid grid-cols-5">
                    {channelUsers.map((user, index) => (
                        <div
                            style={avatarStyle(index)}
                            key={user.uid}
                            data-content={user.username}
                            className="hover:border-2 hover:border-slack-navbar"
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
                                <Popup.Content>{user.username}</Popup.Content>
                            </Popup>
                        </div>
                    ))}
                </div>
                <div className="font-semibold text-md px-2">
                    {channelUsers.length}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default AvatarStack
