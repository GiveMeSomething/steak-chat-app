import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import {
    selectMessages,
    clearSearchMessage,
    setSearchMessages,
    Message
} from 'components/server/redux/messages/messages.slice'
import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'

import { Modal, Icon } from 'semantic-ui-react'
import SearchOptionButton, {
    SearchOptionButtonProps
} from './SearchOptionButton'

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

    const { handleSubmit, register, setFocus, reset } = useForm<FormValues>()

    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)
    const messages = useAppSelector(selectMessages)

    useEffect(() => {
        if (isOpen) {
            setFocus('keyword')
        }
    }, [isOpen])

    const searchOptions: SearchOptionButtonProps[] = [
        {
            buttonLabel: 'Messages',
            iconName: 'comments outline'
        },
        {
            buttonLabel: 'Files',
            iconName: 'file alternate outline'
        },
        {
            buttonLabel: 'Channels',
            iconName: 'list alternate outline'
        },
        {
            buttonLabel: 'Users',
            iconName: 'user outline'
        }
    ]

    // TODO: Regex is very expensive operation, need to find another way
    const getSearchMessages = (keyword: string): Message[] => {
        const messageRegex = new RegExp(`${keyword}`, 'i')

        // Currently only search for messages in currentChannel
        const result = messages.filter((message) =>
            messageRegex.test(message.content)
        )

        return result
    }

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
        if (!data.keyword || data.keyword.trim().length <= 0) {
            // Display as normal when submit empty value
            dispatch(clearSearchMessage())
        } else if (messages) {
            setIsLoading(true)

            const searchKeyword = data.keyword.trim()
            const result = getSearchMessages(searchKeyword)

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
                        className="fullsize px-4"
                        autoComplete="off"
                    />
                </div>
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <h3 className="py-2">{`Searching in #${currentChannel.name}`}</h3>
                    <p className="font-light text-slack-text-blur py-2">
                        I am looking for ...
                    </p>
                    <div className="py-2">
                        {searchOptions.map(
                            ({ buttonLabel, iconName }, index) => (
                                <SearchOptionButton
                                    key={index}
                                    buttonLabel={buttonLabel}
                                    iconName={iconName}
                                />
                            )
                        )}
                    </div>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    )
}

export default SearchModal
