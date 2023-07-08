/* eslint-disable @typescript-eslint/no-misused-promises */
import { Card, Container, Heading } from '@chakra-ui/react'

import { type NextPage } from 'next'


import ClientForm from '~/components/entities/clients/ClientForm';

const NewClient: NextPage = () => {

    return (
        <Container marginTop={8} >
            <Card padding={4} width={{ lg: '50rem' }}>
                <Heading textAlign="center" marginBottom={6}>
                    Crear Cliente
                </Heading>
                <ClientForm />
            </Card>
        </Container>
    )
}

export default NewClient;