import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'

import { Icon } from 'semantic-ui-react'
import AvatarStack from './AvatarStack'

interface MessagesHeaderProps {}

const MessagesHeader: FunctionComponent<MessagesHeaderProps> = () => {
    const currentChannel = useAppSelector(selectCurrentChannel)

    return (
        <div className="flex items-center justify-between px-4 py-3 w-full border-b-2">
            <div className="flex items-center justify-start h-full">
                <div className="flex items-center">
                    <Icon name="hashtag" size="large" />
                    <h3 className="font-semibold">{`${currentChannel.name}`}</h3>
                </div>
                {currentChannel.desc && (
                    <h4 className="mx-4 leading-none">{currentChannel.desc}</h4>
                )}
            </div>
            <AvatarStack />
        </div>
    )
}

export default MessagesHeader
