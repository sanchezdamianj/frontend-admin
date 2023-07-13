/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, ButtonGroup, Card, Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { useRouter } from 'next/router'
import { type ClientListProps } from '~/schemas/ClientSchema'




const ClientsList = ({ clients = [] }: ClientListProps) => {
    const router = useRouter()
    return (
        <Flex flexDirection="column" gap={4} mt={2} p={8} bg={"gray.50"} >
            {clients
                .sort((a, b) => ((b.sales?.amount) || 0) - (a.sales?.amount || 0))
                .map(client => (
                    <Card
                        key={client._id}
                        py={2} px={4}
                        cursor="pointer"
                        _hover={{ bg: "purple.300", color: " white", transition: "0.3s background-color ease-out, 0.2s color ease-out" }}
                        flexDirection={"row"}
                        justifyContent={"space-between"}
                        onClick={() => router.push(`/clients/${client._id}`)}

                    >
                        <Text fontWeight={400}>
                            {client.firstName}
                        </Text>
                        <Text fontWeight={400}>
                            $ {client.sales?.amount.toFixed(2) || 0}
                        </Text>
                    </Card>)
                )
            }
            <ButtonGroup justifyContent={"center"} mt={2}>
                <Button
                    colorScheme='purple'
                    type="submit"
                    onClick={() => router.push('/clients/new')}
                >
                    Create
                </Button>
                <Button
                    colorScheme='purple'
                    type="button"
                    onClick={() => router.push('/')}
                >
                    Back
                </Button>
            </ButtonGroup>
        </Flex >
    )
}

export default ClientsList