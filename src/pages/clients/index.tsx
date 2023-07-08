/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Card, Container, Heading, Spinner } from "@chakra-ui/react";
import axios from "axios";
import { type NextPage } from "next";
import { useQuery } from "react-query";
import { env } from '../../env.mjs'
import ClientList, { type ClientFromDB } from '../../components/entities/clients/ClientsList'



const Clients: NextPage = () => {

    const { data: clients, isLoading } = useQuery({
        queryKey: ['clients'], queryFn: async () => {
            const res = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients`,
                { withCredentials: true })
            return res.data.data
        }
    })

    return (
        <Container>
            <Card marginTop={4}>
                <Heading>Clients</Heading>
                {isLoading ?
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    /> :
                    <ClientList clients={clients as ClientFromDB[]} />
                }
            </Card>
        </Container>

    )

}
export default Clients