import React, { HTMLInputTypeAttribute } from 'react'

interface FormInputProps {
    label: string
    type: HTMLInputTypeAttribute
    className?: string
}

// Using forwardRef() to pass react-hook-form's ref into component ref
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, type, className = '' }, ref) => {
        const inputId = `user ${label}`
        const inputPlaceholder = `Enter ${label.toLowerCase()}`
        return (
            <div className={className}>
                <label htmlFor={inputId} className="capitalize text-xl">
                    {label}
                </label>
                <input
                    id={inputId}
                    ref={ref}
                    className="w-full px-4 py-2 mt-2 rounded-full border-gray-400 border-2 text-xl"
                    placeholder={inputPlaceholder}
                    type={type}
                />
            </div>
        )
    }
)

export default FormInput
