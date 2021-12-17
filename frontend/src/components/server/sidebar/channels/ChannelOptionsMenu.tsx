import React, { FunctionComponent } from 'react'
import { useAppDispatch } from 'redux/hooks'

import {
    setCurrentMetaPanelData,
    setMetaPanelOpen
} from 'components/server/metaPanel/redux/metaPanel.slice'
import { ChannelInfo } from 'components/server/redux/channels/channels.slice'
import {
    unStarSelectedChannel,
    starSelectedChannel
} from 'components/server/redux/channels/channels.thunk'

import { Undefinable } from 'types/commonType'

import { Dropdown, Icon } from 'semantic-ui-react'

interface ChannelOptionsProps {
    starred: boolean
    selectedChannel: Undefinable<ChannelInfo>
    isOpen: boolean
    closeMenu: Function
}

const ChannelOptions: FunctionComponent<ChannelOptionsProps> = ({
    starred,
    isOpen,
    selectedChannel,
    closeMenu
}) => {
    const dispatch = useAppDispatch()

    const menuOptions = {
        notificationSetting: {
            text: 'Change notifications',
            disabled: true
        },
        notificationMute: {
            text: 'Mute channel',
            disabled: true
        },
        copyName: {
            text: 'Copy name',
            disabled: true
        },
        copyLink: {
            text: 'Copy link',
            disabled: true
        },
        toggleStar: {
            text: starred ? 'Unstar channel' : 'Star channel'
        },
        channelDetail: {
            text: 'Open channel details'
        },
        leaveChannel: {
            text: 'Leave channel',
            disabled: true
        }
    }

    const handleOnStarChannel = async (
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        if (selectedChannel) {
            if (starred) {
                await dispatch(unStarSelectedChannel(selectedChannel))
            } else {
                await dispatch(starSelectedChannel(selectedChannel))
            }
        }

        closeMenu(event)
    }

    const handleOnChannelDetail = (event: React.MouseEvent<HTMLDivElement>) => {
        if (selectedChannel) {
            dispatch(setCurrentMetaPanelData(selectedChannel))
        }

        dispatch(setMetaPanelOpen(true))

        closeMenu(event)
    }

    // Dropdown render a ellipsis in-place of normal ellipsis (so when dropdown shown, the channelItem still have a ellipsis)
    return (
        <Dropdown
            icon={null}
            id="channel-settings"
            trigger={<Icon name="ellipsis horizontal" />}
            open={isOpen}
        >
            {/* TODO: Currently hard-coding here */}
            <Dropdown.Menu className="top right text-black text-xl font-light">
                <Dropdown.Item {...menuOptions.notificationSetting} />
                <Dropdown.Item {...menuOptions.notificationMute} />
                <Dropdown.Divider />
                <Dropdown.Item {...menuOptions.copyName} />
                <Dropdown.Item {...menuOptions.copyLink} />
                <Dropdown.Divider />
                <Dropdown.Item
                    {...menuOptions.toggleStar}
                    onClick={handleOnStarChannel}
                />
                <Dropdown.Divider />
                <Dropdown.Item
                    {...menuOptions.channelDetail}
                    onClick={handleOnChannelDetail}
                />
                <Dropdown.Item {...menuOptions.leaveChannel} />
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ChannelOptions
