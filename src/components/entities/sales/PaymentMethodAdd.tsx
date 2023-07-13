/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Flex } from '@chakra-ui/react'
import React from 'react'
import { useFieldArray } from 'react-hook-form'
import MyDeleteIcon from '~/components/ui/icons/DeleteIcon'
import MyInput from '~/components/ui/inputs/MyInput'
import MySelect from '~/components/ui/selects/MySelect'
import { PAYMENT_METHOD_TYPES, TIME_UNITS, type Payment_method, type Sale } from '~/schemas/SalesSchema'

interface Props {
    fieldName: string,
}

export default function PaymentMehodAdd({ fieldName }: Props) {
    const { fields } = useFieldArray({ name: fieldName })

    return (
        <Flex flexDir={"column"} gap={3} mb={4} alignItems='flex-start' >
            {fields.map((field, index) => (
                <Flex key={field.id} gap={2} >
                    <MySelect options={PAYMENT_METHOD_TYPES} fieldName={`payment_method.${index}.method`} label="P.Method" placeholder='Select one' />
                    <MySelect options={Object.keys(TIME_UNITS.enum)} fieldName={`payment_method.${index}.time_unit`} label="Time" />
                    <MyInput fieldName={`payment_method.${index}.time_value`} label='Period' valueAsNumber={true} type="number" placeholder='1' showLabel={index === 0} />
                    <MyInput fieldName={`payment_method.${index}.total_amount`} label='Amount' valueAsNumber={true} placeholder='Amount' />
                    <Flex mb={5} justifyContent={"center"} alignItems={"center"}>
                        <MyDeleteIcon<Sale> fieldName="payment_method" index={index} />
                    </Flex>
                </Flex>
            ))}
        </Flex>
    )
}