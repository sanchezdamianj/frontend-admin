import { FormControl, FormLabel, Select } from '@chakra-ui/react'
import React from 'react'
import { useFormContext } from 'react-hook-form';


interface Props<T> {
    fieldName: keyof T,
    options: readonly string[],
    label: string,
    placeholder?: string,
    flex?: number
}

function MySelect<T>({ options, fieldName, label, placeholder, flex }: Props<T>) {
    const { register, formState: { errors } } = useFormContext()
    return (
        <FormControl marginBottom={5} flex={flex} isInvalid={!!errors[fieldName as string]} isRequired>
            <FormLabel>{label}</FormLabel>
            <Select
                placeholder={placeholder || label}
                {...register(fieldName as string)}>
                {options.map(
                    option => <option key={option} value={option}>{option}</option>
                )}
            </Select>
        </FormControl>
    )
}

export default MySelect