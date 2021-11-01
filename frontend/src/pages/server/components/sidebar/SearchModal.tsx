import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppSelector } from 'redux/hooks'
import { Modal, Icon, Button, SemanticICONS } from 'semantic-ui-react'
import { selectCurrentChannel } from '../channel.slice'

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

    const { handleSubmit, register, setFocus, reset } = useForm<FormValues>()

    const currentChannel = useAppSelector(selectCurrentChannel)

    useEffect(() => {
        if (isOpen) {
            setFocus('keyword')
        }
    }, [isOpen])

    const onClose = () => {
        setIsLoading(false)

        reset()

        setOpen(false)
    }

    const onSubmit = () => {
        console.log(isLoading)

        onClose()
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
                onSubmit={handleSubmit(onSubmit)}
                onClose={onClose}
                dimmer={false}
                centered={false}
                open={isOpen}
                className="rounded-lg"
            >
                <Modal.Header>
                    <div className="flex items-center h-full leading-8">
                        <Icon name="search" size="small" color="grey" />
                        <input
                            {...register('keyword')}
                            placeholder="Search for messages and users"
                            className="w-full h-full px-4"
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
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        </>
    )
}

export default SearchModal
