import React from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { DeleteIcon } from '@chakra-ui/icons'

interface Props<T> {
    index: number,
    fieldName: keyof T
}

export default function MyDeleteIcon<T>({ fieldName, index }: Props<T>) {
    const { control } = useFormContext()
    const { remove } = useFieldArray({ control, name: fieldName as string })
    return (
        <DeleteIcon
            color={index > 0 ? "red.200" : "white"}
            cursor={"pointer"}
            _hover={{ color: index > 0 ? "red.600" : "white" }}
            onClick={() => remove(index)}
        />
    )
}