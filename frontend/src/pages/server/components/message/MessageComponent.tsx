import { UserInfo } from 'pages/auth/components/auth.slice'
import React, { FunctionComponent, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Undefinable } from 'types/commonType'
import { getDateString, getTimeString } from 'utils/timeUtil'
import { selectChannelUsers } from '../slices/channelUsers.slice'
import {
    setCurrentMetaPanelData,
    setMetaPanelOpen,
} from '../slices/metaPanel.slice'
import UserOptionsMenu from './UserOptionsMenu'

interface MessageComponentProps {
    content?: string
    timestamp?: object
    media?: string
    createdBy: {
        uid?: string
        username?: string
        photoUrl?: string
    }
}

type RightClickableComponent = 'avatar' | 'username'

const MessageComponent: FunctionComponent<MessageComponentProps> = ({
    content,
    timestamp,
    createdBy,
    media,
}) => {
    const [selectedComponent, setSelectedComponent] =
        useState<Undefinable<RightClickableComponent>>(undefined)
    const [selectedUser, setSelectedUser] =
        useState<Undefinable<UserInfo>>(undefined)
    const [isUserOptionsOpen, setIsUserOptionsOpen] = useState<boolean>(false)

    const dispatch = useAppDispatch()

    const channelUsers = useAppSelector(selectChannelUsers)

    const imageRef = useRef<HTMLImageElement>(null)

    // Firebase save timestamp as object, but still number when console log
    // So we need to manually cast to number
    const serverTime = timestamp as unknown as number

    const messageTime = `${getDateString(serverTime)}${getTimeString(
        serverTime,
    )}`

    const openUserMetaPanel = () => {
        const selectedUser = channelUsers.find(
            (user) => user.uid === createdBy.uid,
        )

        if (selectedUser) {
            dispatch(setCurrentMetaPanelData(selectedUser))
        }

        dispatch(setMetaPanelOpen(true))
    }

    const handleComponentRightClick = (
        event: React.MouseEvent<HTMLDivElement>,
        type: RightClickableComponent,
    ) => {
        // Prevent open context menu
        event.preventDefault()

        // Prevent event bubbling to onClick
        event.stopPropagation()

        setSelectedUser(channelUsers.find((user) => user.uid === createdBy.uid))
        setSelectedComponent(type)
        setIsUserOptionsOpen(true)
    }

    const closeMessageUserOptions = (
        event: React.MouseEvent<HTMLDivElement>,
    ) => {
        event.preventDefault()

        // Stop event bubbling as avatar click (which trigger the meta panel)
        event.stopPropagation()

        setSelectedComponent(undefined)
        setSelectedUser(undefined)
        setIsUserOptionsOpen(false)
    }

    const showMenuAtComponent = (
        componentType: RightClickableComponent,
    ): boolean => isUserOptionsOpen && selectedComponent === componentType

    return (
        <div className="flex items-start justify-start py-2 text-gray-500">
            <span className="flex items-start">
                <img
                    src={createdBy.photoUrl}
                    alt="avt"
                    className="rounded-md h-12 w-12 cursor-pointer"
                    onClick={openUserMetaPanel}
                    onContextMenu={(e) =>
                        handleComponentRightClick(e, 'avatar')
                    }
                />
                {selectedUser && showMenuAtComponent('avatar') ? (
                    <>
                        <UserOptionsMenu
                            isOpen={isUserOptionsOpen}
                            selectedUser={selectedUser}
                            openMetaPanel={openUserMetaPanel}
                            closeMenu={closeMessageUserOptions}
                        />
                        <div
                            className="absolute h-screen w-screen top-0 left-0 z-10"
                            onClick={closeMessageUserOptions}
                        ></div>
                    </>
                ) : null}
            </span>
            <div className="ml-4">
                <div className="flex items-baseline pb-1">
                    <h3
                        className="font-bold hover:underline cursor-pointer"
                        onClick={openUserMetaPanel}
                        onContextMenu={(e) =>
                            handleComponentRightClick(e, 'username')
                        }
                    >
                        {createdBy.username}
                    </h3>
                    {selectedUser && showMenuAtComponent('username') ? (
                        <>
                            <UserOptionsMenu
                                isOpen={isUserOptionsOpen}
                                selectedUser={selectedUser}
                                openMetaPanel={openUserMetaPanel}
                                closeMenu={closeMessageUserOptions}
                                showAtUsername={true}
                            />
                            <div
                                className="absolute h-screen w-screen top-0 left-0 z-10"
                                onClick={closeMessageUserOptions}
                            ></div>
                        </>
                    ) : null}
                    <h5 className="text-slack-text-blur px-2">{messageTime}</h5>
                </div>
                {content && <h5 className="text-lg">{content}</h5>}
                {media && (
                    <img
                        src={media}
                        className="max-h-40 h-40 p-2"
                        ref={imageRef}
                    />
                )}
            </div>
        </div>
    )
}

export default MessageComponent
