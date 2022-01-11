import React, { HTMLInputTypeAttribute, forwardRef } from 'react'
import { RefCallBack, UseFormRegisterReturn } from 'react-hook-form'

interface FormInputProps {
    label: string
    inputType: HTMLInputTypeAttribute
    className?: string
}

// Using forwardRef() to pass react-hook-form's ref into component ref
// Exclude<UseFormRegisterReturn, { ref: RefCallBack } is to remove the 'ref' from the register
const FormInput = forwardRef<
    HTMLInputElement,
    | FormInputProps
    | Partial<Exclude<UseFormRegisterReturn, { ref: RefCallBack }>>
>(({ label, inputType, className = '', ...props }, useFormRef) => {
    const inputId = `user ${label}`
    const inputPlaceholder = `Enter ${label.toLowerCase()}`

    return (
        <div className={className}>
            <label htmlFor={inputId} className="capitalize text-xl">
                {label}
            </label>
            <input
                id={inputId}
                className="w-full px-4 py-2 mt-2 rounded-full border-gray-400 border-2 text-xl"
                placeholder={inputPlaceholder}
                type={inputType}
                ref={useFormRef}
                {...props}
            />
        </div>
    )
})

export default FormInput
