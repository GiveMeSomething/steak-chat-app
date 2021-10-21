import FormInput from './FormInput'
import React, { FunctionComponent } from 'react'
import { Button, Dropdown, Icon, Modal } from 'semantic-ui-react'

interface AddChannelModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const AddChannelModal: FunctionComponent<AddChannelModalProps> = ({
    isOpen,
    setOpen,
}) => {
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
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
                        <FormInput label="Channel Name" type="text" />
                        <FormInput
                            label="Description (optional)"
                            type="password"
                        />
                    </div>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={() => setOpen(false)}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button color="green" onClick={() => setOpen(false)} disabled>
                    <Icon name="checkmark" /> Create
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default AddChannelModal
