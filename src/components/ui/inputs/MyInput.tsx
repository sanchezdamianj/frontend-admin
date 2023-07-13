import { FormControl, FormLabel, Input, FormErrorMessage } from '@chakra-ui/react';
import * as React from 'react';
import { type ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

export interface Props<T> {
    fieldName: keyof T,
    label: string,
    placeholder?: string,
    flex?: number,
    type?: string,
    showLabel?: boolean,
    valueAsNumber?: boolean
}

export default function MyInput<T>({ fieldName, label, placeholder, type = "text", flex = 4, showLabel = true, valueAsNumber = false }: Props<T>) {
    const { register, formState: { errors } } = useFormContext()
    return (
        <FormControl marginBottom={5} boxShadow={4} isInvalid={!!errors[fieldName as string]} flex={flex}>
            {showLabel && <FormLabel>{label}</FormLabel>}
            <Input
                type={type}
                placeholder={placeholder || label}
                {...register(fieldName as string, { valueAsNumber })} />
            <FormErrorMessage>{errors[fieldName]?.message as ReactNode}</FormErrorMessage>
        </FormControl>
    )
}
