import React, { FunctionComponent, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { UserInfo } from 'components/auth/redux/auth.slice'
import { selectChannelUsers } from 'components/server/redux/users/users.slice'
import {
    setCurrentMetaPanelData,
    setMetaPanelOpen,
} from 'components/server/metaPanel/redux/metaPanel.slice'

import { getDateString, getTimeString } from 'utils/timeUtil'
import { Undefinable } from 'types/commonType'

import ScreenOverlay from 'components/commons/ScreenOverlay'
import OptionsMenu from './OptionsMenu'

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
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isMenuUpward, setIsMenuUpward] = useState<boolean>(false)

    const messageRef = useRef<HTMLDivElement>(null)

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
    const menuStyle = (
        positionAt: Undefinable<RightClickableComponent>,
        shouldMenuUpward: boolean,
    ): string => {
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

    // Pre-calculate option menu direction based on message position on screen
    const shouldMenuUpward = (): boolean => {
        if (messageRef.current) {
            const windowHeight = window.innerHeight
            const menuHeight = messageRef.current.scrollHeight
            const menuYPos = messageRef.current.getBoundingClientRect().bottom
            if (windowHeight - menuYPos < menuHeight) {
                return true
            }
            return false
        }
        return false
    }

    const shouldMenuShowHere = (
        componentType: RightClickableComponent,
    ): boolean => isMenuOpen && selectedComponent === componentType

    const handleOpenUserMetaPanel = (): void => {
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
        componentType: RightClickableComponent,
    ): void => {
        // Prevent open context menu
        event.preventDefault()

        // Prevent event bubbling to onClick
        event.stopPropagation()

        setSelectedUser(channelUsers.find((user) => user.uid === createdBy.uid))
        setSelectedComponent(componentType)

        setIsMenuUpward(shouldMenuUpward)

        setIsMenuOpen(true)
    }

    const handleCloseMessageMenu = (
        event: React.MouseEvent<HTMLDivElement>,
    ): void => {
        event.preventDefault()

        // Stop event bubbling as avatar click (which trigger the user's meta panel)
        event.stopPropagation()

        setSelectedComponent(undefined)
        setSelectedUser(undefined)
        setIsMenuOpen(false)
    }

    const menuWithOverlay = () => {
        return (
            selectedUser && (
                <>
                    <OptionsMenu
                        isOpen={isMenuOpen}
                        selectedUser={selectedUser}
                        openMetaPanel={handleOpenUserMetaPanel}
                        closeMenu={handleCloseMessageMenu}
                        menuStyle={menuStyle(selectedComponent, isMenuUpward)}
                        upward={isMenuUpward}
                    />
                    <ScreenOverlay handleOnClick={handleCloseMessageMenu} />
                </>
            )
        )
    }

    return (
        <div
            className="flex items-start justify-start py-2 text-gray-500"
            ref={messageRef}
        >
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
                {shouldMenuShowHere('avatar') && menuWithOverlay()}
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
                    {shouldMenuShowHere('username') && menuWithOverlay()}
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
