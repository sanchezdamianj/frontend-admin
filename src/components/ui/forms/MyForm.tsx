/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from '@hookform/resolvers/zod'
import React, { type ReactNode } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { z, type AnyZodObject } from 'zod'
import { type FieldValues, type DefaultValues } from 'react-hook-form/dist/types'
import { DevTool } from '@hookform/devtools'
import { Flex, Spinner } from '@chakra-ui/react'

type Props = {
    defaultValues?: DefaultValues<FieldValues>
    zodSchema: AnyZodObject
    onSubmit: (data: any, reset: any) => void
    onError: (data: FieldValues) => void
    children: ReactNode
}

const MyForm = ({ defaultValues, zodSchema, onSubmit, onError, children }: Props) => {
    type EntityType = z.infer<typeof zodSchema>
    const methods = useForm<EntityType>({
        resolver: zodResolver(zodSchema),
        defaultValues
    })
    if (methods.formState.isLoading) return (
        <Flex>
            < Spinner
                thickness='4px'
                speed='0.65s'
                emptyColor='gray.200'
                color='blue.500'
                size='md' />
        </Flex>

    )

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data) => onSubmit(data, methods.reset), onError)}>
                {children}
            </form>
            {/* <DevTool control={methods.control} /> */}
        </FormProvider >
    )
}

export default MyForm

// : async () => {
//     if (!clientId) return
//     const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${clientId}`,
//         { withCredentials: true }
//     )
//     return data.data
// }