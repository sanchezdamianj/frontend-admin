/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Flex, Text, Heading, Divider } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { env } from '~/env.mjs'
import { useState } from 'react'
import { type Sale, saleSchema, type SaleFormProps } from '~/schemas/SalesSchema'
import MyForm from '~/components/ui/forms/MyForm'
import MyInput from '~/components/ui/inputs/MyInput'
import ProductAdd from './ProductAdd'
import PaymentMehodAdd from './PaymentMethodAdd'
import AdderButton from '~/components/ui/buttons/AdderButton'
import DEFAULT_VALUES from '~/components/constants'
import getDateForInput from '~/helpers/getDateForInput'
import { useForm } from 'react-hook-form'
import SaleFormButtons from './SaleFormButtons'

const SaleForm = ({ saleId }: SaleFormProps) => {
    const { reset } = useForm()
    const [totalAmount, setTotalAmount] = useState(0)
    const [foundClient, setFoundClient] = useState<{ _id: string, firstName: string } | null>(null)
    const router = useRouter()

    const onSubmit = async (data: Sale) => {
        if (!foundClient) return
        const PARAMS = saleId ? `${saleId}` : ''
        await axios(
            `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/sales/${PARAMS}`,
            {
                method: !!saleId ? "PUT" : "POST",
                data: { ...data, client: foundClient._id, total_amount: totalAmount },
                withCredentials: true
            }
        )
        reset()
        void router.push('/')

    }

    const onError = (errors: any) => console.log(errors)
    const setDefaultValues = async () => {
        if (!saleId) return {
            operation_date: getDateForInput(new Date()),
            payment_method: [
                DEFAULT_VALUES['payment_method']
            ],
            products: [
                DEFAULT_VALUES["products"]
            ]
        }
        const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/sales/${saleId}`,
            { withCredentials: true }
        )
        return data.data
    }
    return (
        <>
            <MyForm onError={onError} onSubmit={onSubmit} zodSchema={saleSchema} defaultValues={setDefaultValues}>
                <Flex gap={3} flexDirection={"row"}>
                    <MyInput<Sale>
                        fieldName="client_document"
                        label={foundClient ? (<Text alignSelf={"center"}>Document:<span>{foundClient.firstName}</span></Text>
                        ) : 'Document'}
                        placeholder="Document"
                        flex={8}
                        searchFn={async (document) => {
                            // const document = data.client_document
                            if (!document) return
                            const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/document/${document}`,
                                { withCredentials: true })
                            setFoundClient(data.data)
                            // setValue(`client`, data.data._id)
                        }} />
                </Flex>
                <MyInput<Sale> fieldName="operation_date" label="Date" type="date" valueAsDate />
                <Flex flexDir="row" gap={3} mb={4} mt={8} alignItems={"flex-start"} justifyContent={"space-between"} >
                    <Heading flex={6}>Products</Heading>
                    <AdderButton fieldName="products" />
                </Flex>
                <Divider mb={3} mt={2} />
                <ProductAdd fieldName="products" />
                <Flex flexDir="row" gap={3} mb={4} mt={8} alignItems={"flex-start"} justifyContent={"space-between"} >
                    <Heading flex={6} >Payment method</Heading>
                    <AdderButton fieldName="payment_method" />
                </Flex>
                <Divider mb={3} mt={2} />
                <PaymentMehodAdd fieldName='payment_method' />
                <SaleFormButtons saleId={saleId} />
            </MyForm >
        </>
    )
}
export default SaleForm