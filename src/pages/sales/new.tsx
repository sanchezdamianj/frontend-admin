/* eslint-disable @typescript-eslint/no-misused-promises */
import { Card, Container, Heading } from '@chakra-ui/react'

import { type NextPage } from 'next'

import SaleForm from '~/components/entities/sales/SaleForm';

const NewSale: NextPage = () => {

    return (
        <Container marginTop={8}>
            <Card p={4} width={{ lg: '50rem' }}>
                <Heading textAlign="center" mb={6}>
                    Create Sale
                </Heading>
                <SaleForm />
            </Card>
        </Container>
    )
}

export default NewSale;