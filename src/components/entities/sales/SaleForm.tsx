/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Flex, Button, ButtonGroup, Card, Text, Heading, Divider } from '@chakra-ui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useFieldArray, useWatch } from 'react-hook-form'
import { env } from '~/env.mjs'
import { SearchIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { type Payment_method, type Sale, saleSchema, type SaleFormProps, type ProductFormState } from '~/schemas/SalesSchema'
import MyForm from '~/components/ui/forms/MyForm'
import MyInput from '~/components/ui/inputs/MyInput'
import ProductAdd from './ProductAdd'
import PaymentMehodAdd from './PaymentMethodAdd'
import AdderButton from '~/components/ui/buttons/AdderButton'

const defaultPaymentMethod: Payment_method = {
    method: "Credit Card",
    amount: 0,
    time_unit: "Days",
    time_value: 0
}
const defaultProduct: ProductFormState = {
    code: "",
    name: "",
    quantity: 0,
    unit_price: 0,
}

const SaleForm = ({ saleId }: SaleFormProps) => {
    // const [totalAmount, setTotalAmount] = useState(0)
    const [foundClient, setFoundClient] = useState<{ _id: string, firstName: string } | null>(null)
    const router = useRouter()

    // const { append: addProduct } = useFieldArray({
    //     name: "products"
    // })

    // const { append } = useFieldArray({
    //     name: "payment_method"
    // })

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
        // reset()
        void router.push('/')

    }

    const onError = (errors: any) => console.log(errors)
    const setDefaultValues = async () => {
        if (!saleId) return {
            operation_date: new Date(),
            payment_method: [
                defaultPaymentMethod
            ],
            products: [
                defaultProduct
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
                <Flex gap={3}>
                    <MyInput<Sale> fieldName="client_document" label="Document" placeholder="Document" />
                    <IconButton
                        colorScheme='blue'
                        aria-label='Search database'
                        icon={<SearchIcon />}
                        size="md"
                        onClick={async () => {
                            // const document = getValues(`client_document`)
                            if (!document) return
                            const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/document/${document}`,
                                { withCredentials: true })
                            setFoundClient(data.data)
                            setValue(`client`, data.data._id)
                        }
                        }
                    />
                    {!!foundClient && <Card mt={3} p={3}><Text>{foundClient.firstName}</Text>
                    </Card>}
                </Flex>
                <MyInput<Sale> fieldName="operation_date" label="Date" type="date" />
                <Flex flexDir="row" gap={3} mb={4} mt={8} alignItems={"flex-start"} justifyContent={"space-between"} >
                    <Heading flex={6}>Products</Heading>
                    <Button
                        flex={1}
                        size="xs"
                        fontSize="lg"
                        lineHeight="1rem"
                        py={4}
                        onClick={() => addProduct(defaultProduct)}
                        colorScheme='gray'
                        width={75}
                    >
                        Add
                    </Button>
                </Flex>
                <Divider mb={3} mt={2} />
                <ProductAdd fieldName="products" />
                <Flex flexDir="row" gap={3} mb={4} mt={8} alignItems={"flex-start"} justifyContent={"space-between"} >
                    <Heading flex={6} >Payment method</Heading>
                    <AdderButton fieldName="payment_method" />
                </Flex>
                <Divider mb={3} mt={2} />
                <PaymentMehodAdd fieldName='payment_method' />
                <ButtonGroup>
                    <Button
                        colorScheme='purple'
                        type="submit"
                    >
                        {(saleId ? 'Edit' : 'Create')}
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
        </>
    )
}
export default SaleForm