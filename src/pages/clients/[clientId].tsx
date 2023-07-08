/* eslint-disable @typescript-eslint/no-misused-promises */
import { Card, Container, Heading } from '@chakra-ui/react'

import { type NextPage } from 'next'
import { useRouter } from 'next/router';

import ClientForm from '~/components/entities/clients/ClientForm';


const EditClient: NextPage = ({ }) => {
    const router = useRouter()
    return (
        <Container marginTop={8}>
            <Card padding={4}>
                <Heading textAlign="center" marginBottom={6}>
                    Editar Cliente
                </Heading>

                <ClientForm clientId={router.query.clientId as string} />
            </Card>
        </Container>
    )
}

export default EditClient;