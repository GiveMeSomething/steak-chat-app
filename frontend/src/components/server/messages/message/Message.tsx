import React, { FunctionComponent, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { UserInfo } from 'components/auth/redux/auth.slice'
import { selectChannelUsers } from 'components/server/redux/users/users.slice'
import {
    setCurrentMetaPanelData,
    setMetaPanelOpen
} from 'components/server/metaPanel/redux/metaPanel.slice'

import { getDateString, getTimeString } from 'utils/timeUtil'
import { CARD_HEIGHT, MENU_HEIGHT } from 'constants/appConst'
import { Undefinable } from 'types/commonType'

import ScreenOverlay from 'components/commons/overlay/ScreenOverlay'
import UserMenu from './UserMenu'
import UserCard from './UserCard'

interface MessageComponentProps {
    content?: string
    timestamp?: object
    media?: string
    createdBy: UserInfo
}

type ClickableComponent = 'avatar' | 'username'

const MessageComponent: FunctionComponent<MessageComponentProps> = ({
    content,
    timestamp,
    createdBy,
    media
}) => {
    const [selectedComponent, setSelectedComponent] =
        useState<Undefinable<ClickableComponent>>(undefined)
    const [selectedUser, setSelectedUser] =
        useState<Undefinable<UserInfo>>(undefined)

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    const [isCardOpen, setIsCardOpen] = useState<boolean>(false)

    const [isComponentUpward, setIsComponentUpward] = useState<boolean>(false)

    const imageRef = useRef<HTMLImageElement>(null)
    const messageRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()
    const channelUsers = useAppSelector(selectChannelUsers)

    // Firebase save timestamp as object, but still number when console log
    // So we need to manually cast to number
    const serverTime = timestamp as unknown as number

    const messageTime = `${getDateString(serverTime)}${getTimeString(
        serverTime
    )}`

    const menuStyle = (): string => {
        if (selectedComponent === 'username') {
            return 'z-20 -top-6 -left-6'
        } else {
            if (isComponentUpward) {
                return 'z-20 top-6 -left-6'
            } else {
                return 'z-20 top-6 -left-6'
            }
        }
    }

    // Pre-calculate option menu direction based on message position on screen
    const shouldMenuUpward = (menuHeight: number): boolean => {
        if (!menuHeight || !messageRef.current) {
            return false
        }

        const windowHeight = window.innerHeight
        const menuYPos = messageRef.current.getBoundingClientRect().bottom
        if (windowHeight - menuYPos < menuHeight) {
            return true
        }

        return false
    }

    const shouldMenuShowHere = (componentType: ClickableComponent): boolean =>
        isMenuOpen && selectedComponent === componentType

    const shouldCardShowHere = (componentType: ClickableComponent): boolean =>
        isCardOpen && selectedComponent === componentType

    const findSelectedUser = (): void => {
        if (!createdBy || !createdBy.uid) {
            return
        }

        const selectedUser = channelUsers.find(
            (user) => user.uid === createdBy.uid
        )

        setSelectedUser(selectedUser)
    }

    const handleOpenUserMetaPanel = (user: UserInfo): void => {
        dispatch(setCurrentMetaPanelData(user))
        dispatch(setMetaPanelOpen(true))
    }

    /**
     * Handle opening card/menu when user right-click or click
     * @param {React.MouseEvent<T>} event - Normal event object
     * @param {ClickableComponent} componentType - Where the menu/card shown
     */
    const handleComponentClick = (
        event: React.MouseEvent,
        componentType: ClickableComponent
    ): void => {
        findSelectedUser()
        setSelectedComponent(componentType)

        // Reference: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
        switch (event.button) {
            // Main button pressed, usually the left button
            case 0:
                setIsComponentUpward(shouldMenuUpward(CARD_HEIGHT))
                setIsCardOpen(true)
                break
            // Secondary button pressed, usually the right button
            case 2:
                setIsComponentUpward(shouldMenuUpward(MENU_HEIGHT))
                setIsMenuOpen(true)
                break
        }
    }

    const handleCloseMenu = (event: React.MouseEvent<HTMLDivElement>): void => {
        event.preventDefault()

        // Stop event bubbling as avatar click (which trigger the user's meta panel)
        event.stopPropagation()

        setSelectedComponent(undefined)
        setSelectedUser(undefined)
        setIsMenuOpen(false)
        setIsCardOpen(false)
    }

    const menuWithOverlay = () => {
        return (
            selectedUser && (
                <>
                    <UserMenu
                        isOpen={isMenuOpen}
                        selectedUser={selectedUser}
                        openMetaPanel={handleOpenUserMetaPanel}
                        closeMenu={handleCloseMenu}
                        menuStyle={menuStyle()}
                        upward={isComponentUpward}
                    />
                    <ScreenOverlay handleOnClick={handleCloseMenu} />
                </>
            )
        )
    }

    const cardWithOverlay = () => {
        return (
            selectedUser && (
                <>
                    <UserCard
                        isOpen={isCardOpen}
                        selectedUser={selectedUser}
                        openMetaPanel={handleOpenUserMetaPanel}
                        closeCard={handleCloseMenu}
                        cardStyle={menuStyle()}
                        upward={isComponentUpward}
                    />
                    <ScreenOverlay handleOnClick={handleCloseMenu} />
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
                    onMouseUp={(e) => handleComponentClick(e, 'avatar')}
                />
                {shouldCardShowHere('avatar') && cardWithOverlay()}
                {shouldMenuShowHere('avatar') && menuWithOverlay()}
            </span>
            <div className="ml-4">
                <div className="flex items-baseline pb-1">
                    <h3
                        className="font-bold hover:underline cursor-pointer"
                        onMouseDown={(e) => handleComponentClick(e, 'username')}
                    >
                        {createdBy.username}
                    </h3>
                    {shouldCardShowHere('username') && cardWithOverlay()}
                    {shouldMenuShowHere('username') && menuWithOverlay()}
                    <h5 className="text-slack-text-blur px-2">{messageTime}</h5>
                </div>
                {content && <h5 className="text-lg">{content}</h5>}
                {media && (
                    <img
                        src={media}
                        className="max-h-40 h-40 p-2"
                        ref={imageRef}
                        alt={`${createdBy}'s image`}
                    />
                )}
            </div>
        </div>
    )
}

export default MessageComponent
