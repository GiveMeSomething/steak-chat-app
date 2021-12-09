import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { UserInfo } from 'components/auth/redux/auth.slice'

import { Modal, Button, Icon } from 'semantic-ui-react'

import FormInput from 'components/commons/FormInput'
import DescMessage from 'components/commons/formDescription/DescMessage'
import { Undefinable } from 'types/commonType'
import { VIETNAMESE_PHONENUM_REGEX } from 'constants/appConst'

interface UpdateProfileModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedUser: UserInfo
}

interface FormValues {
    fullname: string
    username: string
    role: string
    phonenumber: string
}

const UpdateProfileModal: FunctionComponent<UpdateProfileModalProps> = ({
    isOpen,
    setOpen,
    selectedUser,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [updateError, setUpdateError] =
        useState<Undefinable<string>>(undefined)

    const {
        register,
        reset,
        handleSubmit,
        setFocus,
        setValue,
        formState: { errors },
    } = useForm<FormValues>()

    useEffect(() => {
        if (isOpen) {
            setValue('fullname', selectedUser.fullname || '')
            setValue('username', selectedUser.username)
            setValue('role', selectedUser.role || '')
            setValue('phonenumber', selectedUser.phonenumber || '')

            setFocus('fullname')
        }
    }, [isOpen])

    const onModalClose = () => {
        setUpdateError(undefined)
        setIsLoading(false)

        reset()

        setOpen(false)
    }

    const onSubmit = () => {}

    return (
        <Modal
            as="form"
            onClose={onModalClose}
            size="small"
            dimmer="blurring"
            open={isOpen}
            onSubmit={handleSubmit(onSubmit)}
        >
            <Modal.Header>
                <h1>Edit your profile</h1>
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <div className="grid grid-cols-3 place-items-start">
                        <div className="col-span-2">
                            <div className="mb-4">
                                <FormInput
                                    {...register('fullname', {
                                        maxLength: {
                                            value: 120,
                                            message:
                                                'Full name must not exceeds 120 characters',
                                        },
                                    })}
                                    label="Full name"
                                    type="text"
                                    autoComplete="off"
                                />
                                {errors.fullname && (
                                    <DescMessage
                                        type="error"
                                        message={errors.fullname.message}
                                    />
                                )}

                                <FormInput
                                    {...register('username', {
                                        maxLength: {
                                            value: 120,
                                            message:
                                                'Display name must not exceeds 120 characters',
                                        },
                                    })}
                                    label="Display name"
                                    type="text"
                                    autoComplete="off"
                                />
                                {errors.username ? (
                                    <DescMessage
                                        type="error"
                                        message={errors.username.message}
                                    />
                                ) : (
                                    <DescMessage
                                        className="pt-0 pb-2 text-sm"
                                        type="desc"
                                        message="However you'd like people to refer to you in Steak"
                                    />
                                )}
                            </div>

                            <div className="my-2">
                                <FormInput
                                    {...register('role', {
                                        maxLength: {
                                            value: 120,
                                            message:
                                                'Role must not exceeds 120 characters',
                                        },
                                    })}
                                    label="Server Role"
                                    type="text"
                                    autoComplete="off"
                                />
                                {errors.role ? (
                                    <DescMessage
                                        type="error"
                                        message={errors.role.message}
                                    />
                                ) : (
                                    <DescMessage
                                        className="pt-0 pb-2 text-sm"
                                        type="desc"
                                        message="Let people know what you do"
                                    />
                                )}
                            </div>
                            <div className="my-2">
                                <FormInput
                                    {...register('phonenumber', {
                                        pattern: {
                                            value: VIETNAMESE_PHONENUM_REGEX,
                                            message: 'Invalid phone number',
                                        },
                                    })}
                                    label="Phone number"
                                    type="text"
                                    autoComplete="off"
                                />
                                {errors.phonenumber ? (
                                    <DescMessage
                                        type="error"
                                        message={errors.phonenumber.message}
                                    />
                                ) : (
                                    <DescMessage
                                        className="pt-0 pb-2 text-sm"
                                        type="desc"
                                        message="Enter a phone number"
                                    />
                                )}
                            </div>

                            {updateError && (
                                <DescMessage
                                    type="error"
                                    message={updateError}
                                />
                            )}
                        </div>
                        <div className="col-span-1 w-full px-8 -my-2">
                            <DescMessage type="desc" message="Profile photo" />
                            <img
                                src={selectedUser.photoUrl}
                                alt="Avatar"
                                className="w-full rounded-md"
                            />
                            <div className="w-full flex flex-col items-center">
                                <button className="w-full font-semibold py-2 text-slack-text-dark mt-2 hover:bg-gray-100 border-2 border-gray-300 rounded-md">
                                    Upload Photo
                                </button>
                                <p className="text-red-700 hover:underline cursor-pointer mt-2">
                                    Remove Photo
                                </p>
                            </div>
                        </div>
                    </div>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={onModalClose} disabled={isLoading}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button
                    type="submit"
                    color="green"
                    className="submit"
                    loading={isLoading}
                    disabled={isLoading}
                >
                    <Icon name="checkmark" />
                    Save
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default UpdateProfileModal
