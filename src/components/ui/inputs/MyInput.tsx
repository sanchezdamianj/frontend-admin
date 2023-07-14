/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-empty-function */
import { SearchIcon } from '@chakra-ui/icons';
import { FormControl, FormLabel, Input, FormErrorMessage, IconButton, Flex } from '@chakra-ui/react';
import * as React from 'react';
import { type ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';

export interface Props<T> {
    fieldName: keyof T,
    label: string | React.JSX.Element,
    placeholder?: string,
    flex?: number,
    type?: string,
    showLabel?: boolean,
    valueAsNumber?: boolean,
    valueAsDate?: boolean,
    searchFn?: ((state: any) => void) | boolean
}

export default function MyInput<T>({ fieldName, label, placeholder, type = "text", flex = 1, showLabel = true, valueAsNumber = false, valueAsDate = false, searchFn = false }: Props<T>) {
    const { register, formState: { errors }, getValues } = useFormContext()
    const handleSearch = () => {
        const fieldValue = getValues(fieldName as string)
        if (typeof searchFn === "function") searchFn(fieldValue)
    }
    const registerTypesOptions = valueAsNumber ? { valueAsNumber } : { valueAsDate }

    return (
        <FormControl boxShadow={4} isInvalid={!!errors[fieldName as string]} flex={flex} flexDir={"column"}>
            {showLabel && <FormLabel>{label}</FormLabel>}
            <Flex flexDirection={"row"} gap={2}>
                {searchFn && <IconButton
                    colorScheme='blue'
                    aria-label='Search'
                    icon={<SearchIcon />}
                    size="md"
                    onClick={handleSearch}

                />}
                <Input
                    type={type}
                    placeholder={placeholder}
                    {...register(fieldName as string, registerTypesOptions)}
                />
            </Flex>
            <FormErrorMessage>{errors[fieldName]?.message as ReactNode}</FormErrorMessage>
        </FormControl>
    )
}
