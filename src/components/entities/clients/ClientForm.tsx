/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { Flex, Button, ButtonGroup } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { env } from '~/env.mjs'
import MyForm from '~/components/ui/forms/MyForm'
import MyInput from '~/components/ui/inputs/MyInput'
import MySelect from '~/components/ui/selects/MySelect'
import { ClientSchema, DOC_TYPES, type Client, type ClientFormProps } from '~/schemas/ClientSchema'


const ClientForm = ({ clientId }: ClientFormProps) => {
    const router = useRouter()
    const setDefaultValues = async () => {
        if (!clientId) return
        const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${clientId}`,
            { withCredentials: true }
        )
        return data.data
    }

    const onSubmit = async (data: Client, reset: () => void) => {
        const PARAMS = clientId ? `${clientId}` : ""
        console.log(data)
        await axios(
            `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/${PARAMS}`,
            {
                method: !!clientId ? "PUT" : "POST",
                data,
                withCredentials: true
            }
        )
        reset()
        void router.push('/clients')
    }
    const onError = (errors: any) => console.log(errors)
    return (
        <MyForm onSubmit={(onSubmit)} onError={onError} zodSchema={ClientSchema} defaultValues={setDefaultValues}>
            <MyInput<Client> fieldName="firstName" label='First Name' placeholder='First Name' />
            <MyInput<Client> fieldName="lastName" label='Last Name' placeholder='Last Name' />
            <MyInput<Client> fieldName='email' label='Email' placeholder='Email' />
            <Flex gap={4} marginBottom={4} flexDir={"row"}>
                <MySelect<Client> options={DOC_TYPES} fieldName="document_type" label='Document Types' placeholder='Choose one' flex={4} />
                <MyInput fieldName='document_value' label='Document' placeholder='Document' />
            </Flex>
            <ButtonGroup>
                <Button
                    colorScheme='purple'
                    type="submit"
                >
                    {(clientId ? 'Editar' : 'Crear')}
                </Button>
                <Button
                    colorScheme='gray'
                    type="button"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
            </ButtonGroup>
        </MyForm >
    )
}
export default ClientForm