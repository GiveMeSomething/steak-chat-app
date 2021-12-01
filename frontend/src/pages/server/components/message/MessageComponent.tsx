import ScreenOverlay from 'components/commons/ScreenOverlay'
import { UserInfo } from 'components/auth/redux/auth.slice'
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

    /**
     * @param positionAt - string - Determine menu position
     * @param shouldMenuUpward - boolean - Determine menu direction
     * @return  The corresponding style
     */
    const dropdownStyle =
        (positionAt: Undefinable<RightClickableComponent>) =>
        (shouldMenuUpward: boolean) => {
            if (positionAt === 'username') {
                return 'z-20 -top-6 -left-6'
            } else {
                if (shouldMenuUpward) {
                    return 'z-20 top-6 -left-6'
                } else {
                    return 'z-20 top-6 -left-6'
                }
            }
        }

    const handleOpenUserMetaPanel = () => {
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

    const handleCloseMessageUserOptions = (
        event: React.MouseEvent<HTMLDivElement>,
    ) => {
        event.preventDefault()

        // Stop event bubbling as avatar click (which trigger the meta panel)
        event.stopPropagation()

        setSelectedComponent(undefined)
        setSelectedUser(undefined)
        setIsUserOptionsOpen(false)
    }

    const shouldShowMenuAtComponent = (
        componentType: RightClickableComponent,
    ): boolean => isUserOptionsOpen && selectedComponent === componentType

    return (
        <div className="flex items-start justify-start py-2 text-gray-500">
            <span className="flex items-start">
                <img
                    src={createdBy.photoUrl}
                    alt="avt"
                    className="rounded-md h-12 w-12 cursor-pointer"
                    onClick={handleOpenUserMetaPanel}
                    onContextMenu={(e) =>
                        handleComponentRightClick(e, 'avatar')
                    }
                />
                {selectedUser && shouldShowMenuAtComponent('avatar') ? (
                    <>
                        <UserOptionsMenu
                            isOpen={isUserOptionsOpen}
                            selectedUser={selectedUser}
                            openMetaPanel={handleOpenUserMetaPanel}
                            closeMenu={handleCloseMessageUserOptions}
                            dropdownStyle={dropdownStyle(selectedComponent)}
                        />
                        <ScreenOverlay
                            handleOnClick={handleCloseMessageUserOptions}
                        />
                    </>
                ) : null}
            </span>
            <div className="ml-4">
                <div className="flex items-baseline pb-1">
                    <h3
                        className="font-bold hover:underline cursor-pointer"
                        onClick={handleOpenUserMetaPanel}
                        onContextMenu={(e) =>
                            handleComponentRightClick(e, 'username')
                        }
                    >
                        {createdBy.username}
                    </h3>
                    {selectedUser && shouldShowMenuAtComponent('username') ? (
                        <>
                            <UserOptionsMenu
                                isOpen={isUserOptionsOpen}
                                selectedUser={selectedUser}
                                openMetaPanel={handleOpenUserMetaPanel}
                                closeMenu={handleCloseMessageUserOptions}
                                dropdownStyle={dropdownStyle(selectedComponent)}
                            />
                            <ScreenOverlay
                                handleOnClick={handleCloseMessageUserOptions}
                            />
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
