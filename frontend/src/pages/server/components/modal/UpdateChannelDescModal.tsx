import React, { FunctionComponent } from 'react'
import { ChannelInfo } from '../slices/channel.slice'

interface UpdateChannelDescModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    channelInfo: ChannelInfo
}

const UpdateChannelDescModal: FunctionComponent<UpdateChannelDescModalProps> =
    () => {
        return <div></div>
    }

export default UpdateChannelDescModal
