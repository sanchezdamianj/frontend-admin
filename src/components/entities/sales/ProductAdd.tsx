/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Flex } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import MyDeleteIcon from '~/components/ui/icons/DeleteIcon'
import MySearchIcon from '~/components/ui/icons/SearchIcon'
import MyInput from '~/components/ui/inputs/MyInput'
import { type Sale } from '~/schemas/SalesSchema'

interface Props {
    fieldName: keyof Sale,
}

export default function ProductAdd({ fieldName }: Props) {
    const { fields } = useFieldArray({ name: fieldName as string })
    const { setValue, getValues } = useFormContext()
    const productsState = useWatch({
        name: fieldName
    })

    useEffect(() => {
        const currentProducts = getValues(fieldName)
        if (currentProducts.length > 0) {
            const amount = currentProducts?.reduce((prev: number, curr: number) => prev + curr.quantity * curr.unit_price, 0)

            // setTotalAmount(amount)
            setValue(`payment_method.0.total_amount`, amount)
        }
    }, [productsState])

    return (
        <Flex flexDir={"column"} alignItems="flex-start" mb={4}>
            {
                fields.map((_, index: number) => (
                    <Flex key={index} gap={2} alignItems="flex-end" mb={5}>
                        <MySearchIcon index={index} />
                        <MyInput fieldName={`products.${index}.code`} label="Code" showLabel={index === 0} />
                        <MyInput fieldName={`products.${index}.name`} label="Description" showLabel={index === 0} />
                        <MyInput fieldName={`products.${index}.quantity`} label='Quantity' showLabel={index === 0} valueAsNumber={true} />
                        <MyDeleteIcon<Sale> fieldName="products" index={index} />
                    </Flex>
                ))
            }
        </Flex>
    )
}