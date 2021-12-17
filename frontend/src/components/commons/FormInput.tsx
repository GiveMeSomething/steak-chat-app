import React from 'react'

interface FormInputProps {
    label: string
    type: React.HTMLInputTypeAttribute
    autoComplete: 'off' | 'on'
}

// Using forwardRef() to pass react-hook-form's ref into component ref
const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    (props, ref) => {
        const inputId = 'user' + props.label
        const inputPlaceholder = 'Enter ' + props.label.toLowerCase()
        return (
            <>
                <label htmlFor={inputId} className="capitalize font-semibold">
                    {props.label}
                </label>
                <input
                    id={inputId}
                    ref={ref}
                    className="w-full px-4 py-2 rounded-md my-2 border-gray-400 border-2 text-lg"
                    placeholder={inputPlaceholder}
                    {...props}
                />
            </>
        )
    }
)

export default FormInput
