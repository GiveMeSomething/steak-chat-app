import React, { FunctionComponent, Suspense, useEffect, useState } from 'react'
import { useAppSelector } from 'redux/hooks'

import { selectCurrentUser } from 'components/auth/redux/auth.slice'
import { ChannelInfo } from 'components/server/redux/channels/channels.slice'
import { selectChannelUsers } from 'components/server/redux/users/users.slice'
import { selectChannelDetailsStartIndex } from '../redux/metaPanel.slice'

import {
    Accordion,
    AccordionTitleProps,
    Icon,
    Segment
} from 'semantic-ui-react'
import LoadingOverlay from 'components/commons/overlay/LoadingOverlay'

const UpdateChannelDescModal = React.lazy(
    () => import('components/server/metaPanel/modal/UpdateChannelDescModal')
)
const UpdateChannelNameModal = React.lazy(
    () => import('components/server/metaPanel/modal/UpdateChannelNameModal')
)

interface ChannelDetailPanelProps {
    data: ChannelInfo
}

const ChannelDetailPanel: FunctionComponent<ChannelDetailPanelProps> = ({
    data
}) => {
    const [activeIndex, setActiveIndex] = useState<number>(0)
    const [isUpdateNameModalOpen, setIsUpdateNameModalOpen] =
        useState<boolean>(false)
    const [isUpdateDescModalOpen, setIsUpdateDescModalOpen] =
        useState<boolean>(false)

    const currentUser = useAppSelector(selectCurrentUser)
    const channelUsers = useAppSelector(selectChannelUsers)
    const startIndex = useAppSelector(selectChannelDetailsStartIndex)

    useEffect(() => {
        if (startIndex) {
            setActiveIndex(startIndex)
        }
    }, [startIndex])

    const handleClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        titleProps: AccordionTitleProps
    ) => {
        event.stopPropagation()

        const { index } = titleProps

        // Make sure only one open at a time
        const newIndex = activeIndex === index ? -1 : (index as number)
        setActiveIndex(newIndex)
    }

    const handleChannelNameClick = () => {
        setIsUpdateNameModalOpen(true)
    }

    const handleChannelDescClick = () => {
        setIsUpdateDescModalOpen(true)
    }

    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-center py-4">
                <div className="flex items-center">
                    <Icon name="hashtag" size="large" />
                    <h2 className="font-semibold">{`${data.name}`}</h2>
                </div>
            </div>
            <Accordion>
                <Accordion.Title
                    active={activeIndex === 0}
                    index={0}
                    onClick={handleClick}
                >
                    <Icon name="dropdown" />
                    <Icon name="info circle" />
                    <span className="text-xl ml-1">Abouts</span>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 0}>
                    <div className="px-4">
                        <Segment
                            className="meta-panel__item"
                            onClick={handleChannelNameClick}
                        >
                            <h4 className="font-semibold mb-1">Channel name</h4>
                            <h4>{data.name}</h4>
                        </Segment>
                        <Segment.Group>
                            <Segment
                                className="meta-panel__item"
                                onClick={handleChannelDescClick}
                            >
                                <div>
                                    <h4 className="font-semibold mb-1">
                                        Description
                                    </h4>
                                    {data.desc !== '' ? (
                                        <h4 className="font-semibold">
                                            {data.desc}
                                        </h4>
                                    ) : (
                                        <h4 className="font-light text-slack-text-blur">
                                            Add a description
                                        </h4>
                                    )}
                                </div>
                            </Segment>
                            <Segment className="meta-panel__item">
                                <div>
                                    <h4 className="font-semibold mb-1">
                                        Created by
                                    </h4>
                                    <div className="flex items-center">
                                        <div className="rounded-md max-h-6 w-6 mr-2">
                                            <img
                                                src={data.createdBy?.photoUrl}
                                                className="rounded-md"
                                            />
                                        </div>
                                        <h4 className="leading-6">
                                            <span>
                                                {data.createdBy?.username}
                                            </span>
                                        </h4>
                                    </div>
                                </div>
                            </Segment>
                            <Segment className="meta-panel__danger">
                                <div>
                                    <h4 className="font-semibold">
                                        Leave channel
                                    </h4>
                                </div>
                            </Segment>
                        </Segment.Group>
                    </div>
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 1}
                    index={1}
                    onClick={handleClick}
                >
                    <Icon name="dropdown" />
                    <Icon name="edit" />
                    <span className="text-xl ml-1">Members</span>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 1}>
                    <div className="flex flex-col px-4">
                        <div className="flex items-baseline px-2 py-3 meta-panel__item rounded-md cursor-pointer">
                            <Icon name="plus" />
                            <h3 className="leading-6">
                                <span>Add new user</span>
                            </h3>
                        </div>
                        {channelUsers.map((user) => (
                            <div
                                className="flex items-center p-2 meta-panel__item rounded-md"
                                key={user.uid}
                            >
                                <div className="rounded-md max-h-8 w-8 mr-2">
                                    <img
                                        src={user.photoUrl}
                                        className="rounded-md"
                                    />
                                </div>
                                <h3 className="leading-6">
                                    <span>{`${user.username}${
                                        user.uid === currentUser?.uid
                                            ? ' (you)'
                                            : ''
                                    }`}</span>
                                </h3>
                            </div>
                        ))}
                    </div>
                </Accordion.Content>

                <Accordion.Title
                    active={activeIndex === 2}
                    index={2}
                    onClick={handleClick}
                >
                    <Icon name="dropdown" />
                    <Icon name="setting" />
                    <span className="text-xl ml-1">Settings</span>
                </Accordion.Title>
                <Accordion.Content active={activeIndex === 2}>
                    <div className="px-4">
                        <Segment.Group>
                            <Segment className="meta-panel__item">
                                <div>
                                    <h4 className="font-semibold mb-1">
                                        Notifications
                                    </h4>
                                    <h5>On</h5>
                                </div>
                            </Segment>
                            <Segment className="meta-panel__danger">
                                <div>
                                    <h4 className="font-semibold">
                                        Delete channel
                                    </h4>
                                </div>
                            </Segment>
                        </Segment.Group>
                    </div>
                </Accordion.Content>
            </Accordion>
            <Suspense fallback={<LoadingOverlay />}>
                <UpdateChannelNameModal
                    isOpen={isUpdateNameModalOpen}
                    setOpen={setIsUpdateNameModalOpen}
                    channelInfo={data}
                />
                <UpdateChannelDescModal
                    isOpen={isUpdateDescModalOpen}
                    setOpen={setIsUpdateDescModalOpen}
                    channelInfo={data}
                />
            </Suspense>
        </div>
    )
}

export default ChannelDetailPanel
