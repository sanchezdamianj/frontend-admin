/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { FormControl, FormLabel, Input, FormErrorMessage, FormHelperText, Flex, Select, Button, Spinner, ButtonGroup } from '@chakra-ui/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { env } from '~/env.mjs'


const DOC_TYPES = ["RUC", "CUIT", "Cedula", "Pasaporte"] as const;

const schema = z.object({
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email("Email format invalid"),
    document_type: z.enum(DOC_TYPES),
    document_value: z.string()
})

export type Client = z.infer<typeof schema>

interface Props {
    clientId?: string,
}


const ClientForm = ({ clientId }: Props) => {
    const router = useRouter()

    const { register, control, formState: { errors, isLoading }, handleSubmit, reset } = useForm<Client>({
        resolver: zodResolver(schema),
        defaultValues: async () => {
            if (!clientId) return
            const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${clientId}`,
                { withCredentials: true }
            )
            return data.data
        }
    })

    const onSubmit = async (data: Client) => {
        const PARAMS = clientId ? `${clientId}` : ""
        console.log(data)
        await axios(
            `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${PARAMS}}`,
            {
                method: !!clientId ? "PUT" : "POST",
                data,
                withCredentials: true
            }
        )
        reset()
        void router.push('/clients')

    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl marginBottom={5} boxShadow={4} isInvalid={!!errors.firstName} isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter your name"
                        {...register("firstName")} />
                    <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
                </FormControl>
                <FormControl marginBottom={5} isInvalid={!!errors.lastName} isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter your last Name"
                        {...register("lastName")} />
                    <FormHelperText>{errors.lastName?.message}</FormHelperText>
                </FormControl>
                <FormControl marginBottom={5} isInvalid={!!errors.email} isRequired>
                    <FormLabel>Email address</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter your email"
                        {...register("email")} />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                    <FormHelperText>We ll never share your email.</FormHelperText>
                </FormControl>

                <Flex gap={4} marginBottom={4}>
                    <FormControl marginBottom={5} isInvalid={!!errors.document_type} isRequired>
                        <FormLabel>Document Type</FormLabel>
                        <Select
                            placeholder='Select one'
                            {...register("document_type")}>
                            {DOC_TYPES.map(
                                docType => <option key={docType} value={docType}>{docType}</option>
                            )}
                        </Select>
                        <FormErrorMessage>{errors.document_type?.message}</FormErrorMessage>
                    </FormControl>
                    <FormControl marginBottom={5} isInvalid={!!errors.document_value} isRequired>
                        <FormLabel>Document Number</FormLabel>
                        <Input
                            type="text"
                            placeholder="Document value"
                            {...register("document_value")} />
                        <FormErrorMessage>{errors.document_value?.message}</FormErrorMessage>
                        <FormHelperText>We ll never share your credentials.</FormHelperText>
                    </FormControl>

                </Flex>
                <ButtonGroup>
                    <Button
                        colorScheme='purple'
                        type="submit"
                    >
                        {isLoading ?
                            <Spinner
                                thickness='4px'
                                speed='0.65s'
                                emptyColor='gray.200'
                                color='blue.500'
                                size='md' />
                            :
                            (clientId ? 'Editar' : 'Crear')}
                    </Button>
                    <Button
                        colorScheme='gray'
                        type="button"
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                </ButtonGroup>
            </form>
            <DevTool control={control} />
        </>
    )
}

export default ClientForm