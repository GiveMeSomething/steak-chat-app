import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'
import {
    selectMessages,
    clearSearchMessage,
    setSearchMessages
} from 'components/server/redux/messages/messages.slice'

import { Undefinable } from 'types/commonType'

import { Modal, Icon } from 'semantic-ui-react'
import SearchOptionButton from './SearchOptionButton'

interface SearchModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    keyword: string
}

const SearchModal: FunctionComponent<SearchModalProps> = ({
    isOpen,
    setOpen
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchError, setSearchError] = useState<Undefinable<string>>('')

    const { handleSubmit, register, setFocus, reset } = useForm<FormValues>()

    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)
    const messages = useAppSelector(selectMessages)

    useEffect(() => {
        if (isOpen) {
            setFocus('keyword')
        }
    }, [isOpen])

    useEffect(() => {
        if (!messages || messages.length === 0) {
            setSearchError(
                'There is nothing in this channel. Try adding a new message 😉'
            )
        } else {
            setSearchError(undefined)
        }
    }, [messages])

    const onClose = () => {
        // Clear all current loading
        setIsLoading(false)

        // Reset keyword input value
        reset()

        // Clear search result
        dispatch(clearSearchMessage())

        // Close search modal
        setOpen(false)
    }

    const onSubmit = (data: FormValues) => {
        // Display as normal when submit empty value
        if (!data.keyword || data.keyword.trim().length <= 0) {
            dispatch(clearSearchMessage())
        } else if (messages) {
            setIsLoading(true)

            const searchMessages = [...messages]
            const messageRegex = new RegExp(`${data.keyword.trim()}`, 'i')

            // Currently only search for messages in currentChannel
            const result = searchMessages.filter((message) =>
                messageRegex.test(message.content)
            )

            dispatch(setSearchMessages(result))

            setIsLoading(false)
        }
    }

    return (
        <Modal
            closeIcon
            id="custom__modal"
            as="form"
            className="rounded-lg"
            dimmer={false}
            centered={false}
            open={isOpen}
            closeOnDimmerClick={!isLoading}
            closeOnEscape={!isLoading}
            onSubmit={handleSubmit(onSubmit)}
            onClose={onClose}
        >
            <Modal.Header>
                <div className="flex items-center h-full leading-8">
                    <Icon
                        name={isLoading ? 'circle notch' : 'search'}
                        size="small"
                        color="grey"
                        loading={isLoading}
                    />
                    <input
                        {...register('keyword')}
                        placeholder="Search for messages and users"
                        className="w-full h-full px-4"
                        autoComplete="off"
                    />
                </div>
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    {
                        // Display error if have any
                        searchError ? (
                            <h3 className="py-2">{searchError}</h3>
                        ) : (
                            <>
                                <h3 className="py-2">{`Searching in #${currentChannel.name}`}</h3>
                                <p className="font-light text-slack-text-blur py-2">
                                    I am looking for ...
                                </p>
                                <div className="py-2">
                                    <SearchOptionButton
                                        buttonLabel="Messages"
                                        iconName="comments outline"
                                    />
                                    <SearchOptionButton
                                        buttonLabel="Files"
                                        iconName="file alternate outline"
                                    />
                                    <SearchOptionButton
                                        buttonLabel="Messages"
                                        iconName="list alternate outline"
                                    />
                                    <SearchOptionButton
                                        buttonLabel="Messages"
                                        iconName="user outline"
                                    />
                                </div>
                            </>
                        )
                    }
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default SearchModal
