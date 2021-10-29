import React, { FunctionComponent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Modal, Button, Icon } from 'semantic-ui-react'

import FormInput from './FormInput'

interface AddMediaModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    media: any
    desc?: string
}

const AddMediaModal: FunctionComponent<AddMediaModalProps> = ({
    isOpen,
    setOpen,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { handleSubmit } = useForm<FormValues>()

    const onSubmit = (data: FormValues) => {
        console.log(data)

        setIsLoading(false)
    }
    return (
        <>
            <Modal
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                size="tiny"
                dimmer="blurring"
                open={isOpen}
            >
                <Modal.Header>
                    <h1>Upload image</h1>
                </Modal.Header>
                <Modal.Content>
                    <div className="flex flex-col items-center justify-center bg-slack-sidebar-blur py-10">
                        <label
                            htmlFor="upload-file"
                            className="bg-slack-sidebar-hover text-white px-6 py-2 rounded-md cursor-pointer"
                        >
                            Add your image
                        </label>
                        <input
                            type="file"
                            accept="png jpeg jpg"
                            id="upload-file"
                            hidden
                        />
                    </div>
                    <div className="pt-6">
                        <FormInput
                            label="Description (optional)"
                            type="text"
                            autoComplete="off"
                        />
                    </div>
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
                        <Icon name="checkmark" /> Add
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default AddMediaModal
