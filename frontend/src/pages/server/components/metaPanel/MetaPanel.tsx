import { selectCurrentUser, UserInfo } from 'pages/auth/components/auth.slice'
import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { ChannelInfo, selectCurrentChannel } from '../slices/channel.slice'
import {
    selectMetaPanelCurrentData,
    setCurrentData,
} from '../slices/metaPanel.slice'
import ChannelDetailPanel from './ChannelDetailPanel'
import UserDetailPanel from './UserDetailPanel'

interface MetaPanelProps {}

const MetaPanel: FunctionComponent<MetaPanelProps> = () => {
    const dispatch = useAppDispatch()

    const currentMetaPanelData = useAppSelector(selectMetaPanelCurrentData)
    const currentChannel = useAppSelector(selectCurrentChannel)
    const currentUser = useAppSelector(selectCurrentUser)

    if (currentUser) {
        // Bypass TS check to run test on channelInfo or currentUser 😅
        console.log(currentChannel)
        console.log(currentUser)

        dispatch(setCurrentData(currentChannel))
        // dispatch(setCurrentData(currentUser))
    }

    // TODO: Move this into util file if used again
    // User-defined typeguard to check TS type at runtime
    // Reference: https://www.typescriptlang.org/docs/handbook/advanced-types.html
    // Reference: https://rangle.io/blog/how-to-use-typescript-type-guards/
    const isChannelInfo = (object: any): object is ChannelInfo =>
        (object as ChannelInfo).id !== undefined

    const isUserInfo = (object: any): object is UserInfo =>
        (object as UserInfo).uid !== undefined

    // Decide meta panel content based on currentData type (ChannelInfo | UserInfo)
    const metaPanelContent = () => {
        if (currentMetaPanelData) {
            if (isChannelInfo(currentMetaPanelData)) {
                return <ChannelDetailPanel />
            }
            if (isUserInfo(currentMetaPanelData)) {
                return <UserDetailPanel />
            }
        } else {
            return (
                <div className="flex items-center justify-center">
                    Nothing is selected
                </div>
            )
        }
    }

    return (
        <div className="flex w-full h-full flex-col border-l-2">
            <div className="flex items-center px-4 py-3 border-b-2">
                <h3 className="font-semibold">Channel Details</h3>
            </div>
            {metaPanelContent()}
        </div>
    )
}

export default MetaPanel
