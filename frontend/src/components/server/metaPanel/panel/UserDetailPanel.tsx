import { selectCurrentUser, UserInfo } from 'components/auth/redux/auth.slice'
import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { setIsDirectChannel } from 'components/server/redux/channels/channels.slice'
import { setCurrentChannel } from 'components/server/redux/channels/channels.thunk'

import { UserStatus } from 'types/appEnum'
import {
    generateDirectChannelInfo,
    getDirectChannelId
} from 'utils/channelUtil'

import { Button, Icon } from 'semantic-ui-react'
import { setEditProfileOpen } from '../redux/metaPanel.slice'

interface UserDetailPanelProps {
    data: UserInfo
}

const UserDetailPanel: FunctionComponent<UserDetailPanelProps> = ({ data }) => {
    const dispatch = useAppDispatch()

    const currentUser = useAppSelector(selectCurrentUser)

    const handleOnEditProfileClick = () => {
        dispatch(setEditProfileOpen(true))
    }

    const handleOnMessageClick = () => {
        const { uid, username } = data
        if (currentUser) {
            const channelId = getDirectChannelId(currentUser.uid, uid)

            const directChannelInfo = generateDirectChannelInfo(
                currentUser,
                channelId,
                username
            )

            if (directChannelInfo) {
                dispatch(setIsDirectChannel(true))
                dispatch(setCurrentChannel(directChannelInfo))
            }
        }
    }

    return (
        <div className="w-full">
            <div className="my-4 mx-20">
                <div className="aspect-w-1 aspect-h-1">
                    <img
                        src={data.photoUrl}
                        alt="Avatar"
                        className="w-full rounded-md"
                    />
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-2 w-full">
                <div className="flex items-baseline justify-center">
                    <h2 className="font-semibold p-2">{data.username}</h2>
                    <Icon
                        name="circle"
                        color={
                            data.status === UserStatus.ONLINE ? 'green' : 'grey'
                        }
                        size="small"
                    />
                </div>
            </div>
            {
                // TODO: Maybe seperate to another button components
                currentUser?.uid === data.uid ? (
                    <div className="grid grid-cols-3 text-base font-normal mx-10 my-4">
                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <Button circular icon="smile outline" />
                            <p className="mt-1">Set status</p>
                        </div>
                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <Button
                                circular
                                icon="pencil"
                                onClick={handleOnEditProfileClick}
                            />
                            <p className="mt-1">Edit profile</p>
                        </div>
                        <div className="col-span-1 flex flex-col items-center justify-center">
                            <Button circular icon="ellipsis horizontal" />
                            <p className="mt-1">More</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid text-base font-normal mx-10 my-4">
                        <div className="flex flex-col items-center justify-center">
                            <Button
                                circular
                                icon="comments"
                                onClick={handleOnMessageClick}
                            />
                            <p className="mt-1">Messages</p>
                        </div>
                    </div>
                )
            }

            <div className="flex flex-col px-4 font-light gap-4 pt-4">
                {data.fullname && (
                    <div>
                        <h3 className="font-semibold">Full name</h3>
                        <h3>{data.fullname}</h3>
                    </div>
                )}
                <div>
                    <h3 className="font-semibold">Display name</h3>
                    <h3>{data.username}</h3>
                </div>
                <div>
                    <h3 className="font-semibold">Email</h3>
                    <h3>{data.email}</h3>
                </div>
                {data.phonenumber && (
                    <div>
                        <h3 className="font-semibold">Phone number</h3>
                        <h3>{data.phonenumber}</h3>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserDetailPanel
