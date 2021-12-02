import React, { FunctionComponent, useState } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { useForm } from 'react-hook-form'

import { addNewChannel } from '../../redux/channel.slice'

import { formatChannelName } from 'utils/channelUtil'

import { Button, Dropdown, Icon, Modal } from 'semantic-ui-react'

import FormInput from 'components/server/modal/FormInput'
import ErrorMessage from 'components/commons/ErrorMessage'

interface AddChannelModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    channelName: string
    channelDesc: string
}

const AddChannelModal: FunctionComponent<AddChannelModalProps> = ({
    isOpen,
    setOpen,
}) => {
    const [isLoading, setLoading] = useState<boolean>(false)
    const {
        register,
        handleSubmit,
        clearErrors,
        reset,
        formState: { errors },
    } = useForm<FormValues>()

    const dispatch = useAppDispatch()

    async function onSubmit(data: FormValues) {
        setLoading(true)

        // Format channel name
        // e.g. Hello World -> hello-world
        const channelName = formatChannelName(data.channelName)

        // Add new channel to firebase's database
        await dispatch(addNewChannel({ ...data, channelName: channelName }))

        handleClose()
    }

    const handleClose = () => {
        // Reset form state
        clearErrors()
        reset()

        // Close the modal
        setLoading(false)
        setOpen(false)
    }

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            onClose={handleClose}
            size="tiny"
            dimmer="blurring"
            open={isOpen}
        >
            <Modal.Header>
                <h1>Create a channel</h1>
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <h3>
                        Channels are where your team communicates. They’re best
                        when organized around a topic — #marketing, for example.
                    </h3>
                    <Dropdown.Divider />
                    <div className="py-4">
                        <FormInput
                            {...register('channelName', {
                                required: 'This field is required',
                                minLength: {
                                    value: 6,
                                    message:
                                        'Channel name must be longer than 6 characters',
                                },
                            })}
                            label="Channel Name"
                            type="text"
                            autoComplete="off"
                        />
                        {errors.channelName && (
                            <ErrorMessage
                                content={errors.channelName.message}
                            />
                        )}
                        <FormInput
                            {...register('channelDesc')}
                            label="Description (optional)"
                            type="text"
                            autoComplete="off"
                        />
                    </div>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => setOpen(false)}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button
                    type="submit"
                    color="green"
                    disabled={isLoading}
                    loading={isLoading}
                    className="submit"
                >
                    <Icon name="checkmark" /> Create
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default AddChannelModal
