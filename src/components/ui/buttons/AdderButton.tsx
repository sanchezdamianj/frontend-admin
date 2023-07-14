/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button } from '@chakra-ui/react'
import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import DEFAULT_VALUES from '~/components/constants'
import { type Sale } from '~/schemas/SalesSchema'

interface Props {
    fieldName: keyof Sale
}

export default function AdderButton({ fieldName }: Props) {
    const { control } = useFormContext()
    const { append } = useFieldArray({ control, name: fieldName })

    const defaultValue = DEFAULT_VALUES[fieldName as string]

    return (
        <Button
            onClick={() => append(defaultValue)}
            colorScheme='gray'
            width={75}
            flex={1}
            size="xs"
            fontSize="lg"
            lineHeight="1rem"
            py={4}
        >Add</Button>
    )
}