import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Modal, Icon, Button, SemanticICONS } from 'semantic-ui-react'
import { selectCurrentChannel } from '../channel.slice'
import {
    clearSearchMessage,
    Message,
    selectMessages,
    setSearchMessages,
} from '../message.slice'

interface SearchModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    keyword: string
}

const SearchModal: FunctionComponent<SearchModalProps> = ({
    isOpen,
    setOpen,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [searchError, setSearchError] = useState<string>('')

    const { handleSubmit, register, setFocus, reset } = useForm<FormValues>()

    const currentChannel = useAppSelector(selectCurrentChannel)
    const messages = useAppSelector(selectMessages)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isOpen) {
            setFocus('keyword')
        }
    }, [isOpen])

    useEffect(() => {
        if (!messages || messages.length === 0) {
            setSearchError(
                'There is nothing in this channel. Try adding a new message 😉',
            )
        } else {
            setSearchError('')
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
        if (messages) {
            setIsLoading(true)

            const searchMessages = [...messages]
            const messageRegex = new RegExp(data.keyword, 'gi')

            // Currently only search for messages in currentChannel
            const result = searchMessages.filter(
                (message: Message) =>
                    message.content && message.content.match(messageRegex),
            )

            dispatch(setSearchMessages(result))

            setTimeout(() => {
                setIsLoading(false)
            }, 500)
        }
    }

    const CustomSearchButton = ({
        buttonLabel,
        iconName,
    }: {
        buttonLabel: string
        iconName: SemanticICONS
    }) => (
        <Button icon className="font-light">
            <Icon className="mx-2" name={iconName} />
            <span className="px-2">{buttonLabel}</span>
        </Button>
    )

    return (
        <>
            <Modal
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
                            searchError && searchError !== '' ? (
                                <h3 className="py-2">{searchError}</h3>
                            ) : (
                                <>
                                    <h3 className="py-2">{`Searching in #${currentChannel.name}`}</h3>
                                    <p className="font-light text-slack-text-blur py-2">
                                        I am looking for ...
                                    </p>
                                    <div className="py-2">
                                        <CustomSearchButton
                                            buttonLabel="Messages"
                                            iconName="comments outline"
                                        />
                                        <CustomSearchButton
                                            buttonLabel="Files"
                                            iconName="file alternate outline"
                                        />
                                        <CustomSearchButton
                                            buttonLabel="Messages"
                                            iconName="list alternate outline"
                                        />
                                        <CustomSearchButton
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
        </>
    )
}

export default SearchModal
