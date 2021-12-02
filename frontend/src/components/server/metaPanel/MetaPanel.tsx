import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { UserInfo } from 'components/auth/redux/auth.slice'

import { Undefinable } from 'types/commonType'

import { Button } from 'semantic-ui-react'

import ChannelDetailPanel from './ChannelDetailPanel'
import UserDetailPanel from './UserDetailPanel'
import {
    selectMetaPanelCurrentData,
    setMetaPanelOpen,
    clearCurrentMetaPanelData,
} from 'components/server/redux/metaPanel.slice'
import { ChannelInfo } from 'components/server/redux/channels/channels.slice'

interface MetaPanelProps {}

enum ItemDataType {
    ChannelInfo = 'Channel Details',
    UserInfo = 'User Details',
}

const MetaPanel: FunctionComponent<MetaPanelProps> = () => {
    const [currentDataType, setCurrentDataType] =
        useState<Undefinable<ItemDataType>>(undefined)

    const dispatch = useAppDispatch()

    const currentMetaPanelData = useAppSelector(selectMetaPanelCurrentData)

    useEffect(() => {
        if (currentMetaPanelData) {
            if (isChannelInfo(currentMetaPanelData)) {
                setCurrentDataType(ItemDataType.ChannelInfo)
            }
            if (isUserInfo(currentMetaPanelData)) {
                setCurrentDataType(ItemDataType.UserInfo)
            }
        }
    }, [currentMetaPanelData])

    const handleOnCloseClick = () => {
        dispatch(setMetaPanelOpen(false))

        dispatch(clearCurrentMetaPanelData())
    }

    // TODO: Move this into util file if used again
    // User-defined typeguard to check TS type at runtime
    // Reference: https://www.typescriptlang.org/docs/handbook/advanced-types.html
    // Reference: https://rangle.io/blog/how-to-use-typescript-type-guards/
    const isChannelInfo = (object: any): object is ChannelInfo =>
        (object as ChannelInfo).id !== undefined

    const isUserInfo = (object: any): object is UserInfo =>
        (object as UserInfo).uid !== undefined

    if (currentMetaPanelData) {
        // Decide meta panel content based on currentData type (ChannelInfo | UserInfo)
        const metaPanelContent = () => {
            switch (currentDataType) {
                case ItemDataType.ChannelInfo:
                    return (
                        <ChannelDetailPanel
                            data={currentMetaPanelData as ChannelInfo}
                        />
                    )
                case ItemDataType.UserInfo:
                    return (
                        <UserDetailPanel
                            data={currentMetaPanelData as UserInfo}
                        />
                    )
                default:
                    return null
            }
        }

        return (
            <div className="flex w-full h-full flex-col border-l-2">
                <div className="flex items-center justify-between px-4 border-b-2 py-2">
                    <h3 className="font-semibold leading-none">
                        {currentDataType}
                    </h3>
                    <Button
                        basic
                        icon="x"
                        color="red"
                        id="custom-no-outline-button"
                        size="tiny"
                        onClick={handleOnCloseClick}
                    />
                </div>
                <div
                    className="flex flex-1 flex-col overflow-auto"
                    id="member-panel__content"
                >
                    {metaPanelContent()}
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default MetaPanel
