/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { FormControl, FormLabel, Input, FormErrorMessage, FormHelperText, Flex, Select, Button, Spinner, ButtonGroup, Card, Text, Heading, Divider } from '@chakra-ui/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { env } from '~/env.mjs'
import { DeleteIcon, SearchIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'


const PAYMENT_METHOD_TYPES = [
    "Credit Card",
    "Debit Card",
    "Debt Compensation"
] as const

const TIME_UNITS = z.enum(["Days", "Month", "Years"]);

const saleProductSchema = z.object({
    code: z.string(),
    name: z.string().optional(),
    quantity: z.number(),
    unit_price: z.number(),
    discount: z.number().optional()
}
)
const salePaymentMethodSchema = z.object({
    method: z.string(),
    amount: z.number(),
    time_unit: z.string(),
    time_value: z.number()

})

const saleSchema = z.object({
    operation_date: z.date(),
    products: z.array(saleProductSchema),
    client_document: z.string(),
    payment_method: z.array(salePaymentMethodSchema)
})



interface Product extends ProductFormState {
    supplier_cost: number,
    iva: number,
    micro: number,
    salvament_cost: number,
    profit_margin: number
}

interface Props {
    saleId?: string,
}

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
export type Payment_method = z.infer<typeof salePaymentMethodSchema>

export type Sale = z.infer<typeof saleSchema>
export type ProductFormState = z.infer<typeof saleProductSchema>



const SaleForm = ({ saleId }: Props) => {
    const [totalAmount, setTotalAmount] = useState(0)
    const [foundClient, setFoundClient] = useState<{ _id: string, firstName: string } | null>(null)
    const router = useRouter()
    const { register, control, formState: { errors, isLoading }, handleSubmit, reset, setValue, getValues } = useForm<Sale>({
        resolver: zodResolver(saleSchema),
        defaultValues: async () => {
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
    })
    const productsState = useWatch({
        control,
        name: "products"
    })


    const { fields, append, remove } = useFieldArray({
        control,
        name: "payment_method"
    })
    const { fields: products, append: addProduct, remove: removeProduct } = useFieldArray({
        control,
        name: "products"
    })

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

    useEffect(() => {
        const currentProducts = getValues("products")
        if (currentProducts.length > 0) {
            const amount = currentProducts.reduce((prev, curr) => prev + curr.quantity * curr.unit_price, 0)

            setTotalAmount(amount)
            setValue(`payment_method.0.total_amount`, amount)
        }
    }, [productsState, totalAmount])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit, onError)}>
                <FormControl marginBottom={5} boxShadow={4} isInvalid={!!errors.client_document} isRequired>
                    <FormLabel>Client document</FormLabel>
                    <Flex gap={3}>
                        <IconButton
                            colorScheme='blue'
                            aria-label='Search database'
                            icon={<SearchIcon />}
                            size="md"
                            onClick={async () => {
                                const document = getValues(`client_document`)
                                if (!document) return
                                const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/clients/document/${document}`,
                                    { withCredentials: true })
                                setFoundClient(data.data)
                                setValue(`client`, data.data._id)
                            }
                            }
                        />
                        <Input
                            type="text"
                            placeholder="Enter your document"
                            {...register("client_document")} />
                    </Flex>
                    {!!foundClient && <Card mt={3} p={3}><Text>{foundClient.firstName}</Text>
                    </Card>}
                    <FormErrorMessage>{errors?.client_document?.message}</FormErrorMessage>
                </FormControl>
                <FormControl marginBottom={5} isInvalid={!!errors.operation_date} isRequired>
                    <FormLabel>Operation date</FormLabel>
                    <Input type="date" {...register(`operation_date`, { valueAsDate: true })} />

                    <FormHelperText>{errors.operation_date?.message}</FormHelperText>
                </FormControl>

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
                <Flex flexDir={"column"} alignItems="flex-start" mb={4}>
                    {products.map((field, index) => (
                        <Flex key={index} gap={2} alignItems="flex-end" mb={5}>
                            <IconButton
                                colorScheme='blue'
                                aria-label='Search database'
                                icon={<SearchIcon />}
                                size="md"
                                onClick={async () => {
                                    const code = getValues(`products.${index}.code`)
                                    if (!code) return
                                    const { data } = await axios.get(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/products/${code}`,
                                        { withCredentials: true })
                                    const product: Product = data.data
                                    const { supplier_cost, micro, profit_margin, salvament_cost } = product
                                    const baseCost = micro + supplier_cost
                                    const minimumCost = baseCost / (1 - salvament_cost)
                                    const finalPrice = +((minimumCost / (1 - profit_margin)).toFixed(3))

                                    if (!!product) {
                                        setValue(`products.${index}`, {
                                            code: code,
                                            name: product.name,
                                            quantity: 1,
                                            unit_price: finalPrice
                                        })
                                    } else {
                                        console.log('Product no exist')
                                    }
                                }
                                }
                            />
                            <FormControl flex={2} >
                                {index === 0 && <FormLabel>Code</FormLabel>}
                                <Input
                                    type="text"
                                    placeholder="Code"
                                    {...register(`products.${index}.code`)}
                                />
                                <FormErrorMessage>{errors.products?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl flex={4}>
                                {index === 0 && <FormLabel>Description</FormLabel>}
                                <Input
                                    placeholder='Description'
                                    {...register(`products.${index}.name`)}
                                    disabled
                                />

                            </FormControl>

                            <FormControl flex={3} >
                                {index === 0 && <FormLabel>Quantity</FormLabel>}
                                <Input
                                    type="number"
                                    placeholder="quantity"
                                    {...register(`products.${index}.quantity`, { valueAsNumber: true })}
                                />
                            </FormControl>

                            <DeleteIcon
                                color='red.200'
                                minHeight={"2rem"}
                                minW={"1.5rem"}
                                cursor={"pointer"}
                                _hover={{ color: "red.600" }}
                                onClick={() => removeProduct()}
                            >
                            </DeleteIcon>


                        </Flex>
                    ))}

                </Flex>
                <Flex flexDir="row" gap={3} mb={4} mt={8} alignItems={"flex-start"} justifyContent={"space-between"} >
                    <Heading flex={6} >Payment method</Heading>
                    <Button
                        onClick={() => append(defaultPaymentMethod)}
                        colorScheme='gray'
                        width={75}
                        flex={1}
                        size="xs"
                        fontSize="lg"
                        lineHeight="1rem"
                        py={4}
                    >Add</Button>
                </Flex>
                <Divider mb={3} mt={2} />
                <Flex flexDir={"column"} gap={3} mb={4} alignItems='flex-start' >
                    {fields.map((field, index) => (
                        <Flex key={field.id} gap={2} >
                            <FormControl mb={5}>
                                <FormLabel>P.Method</FormLabel>
                                <Select
                                    placeholder='Select one'
                                    {...register(`payment_method.${index}.method`)}>
                                    {PAYMENT_METHOD_TYPES.map(
                                        method => <option key={method} value={method}>{method}</option>
                                    )}
                                </Select>
                                <FormErrorMessage>{errors.payment_method?.message}</FormErrorMessage>
                            </FormControl>

                            <FormControl >
                                <FormLabel>Time</FormLabel>
                                <Select
                                    placeholder='How many?'
                                    {...register("payment_method.0.time_unit")}>
                                    {Object.keys(TIME_UNITS.Enum).map(
                                        unit => <option key={unit} value={unit}>{unit}</option>
                                    )}
                                </Select>
                            </FormControl>

                            <FormControl >
                                <FormLabel>Dues</FormLabel>
                                <Input
                                    type="number"
                                    placeholder="1"
                                    {...register(`payment_method.${index}.time_value`, { valueAsNumber: true })}
                                />


                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel>Amount</FormLabel>
                                <Input
                                    type="text"
                                    placeholder="Amount"
                                    {...register(`payment_method.${index}.total_amount`, { valueAsNumber: true })} />
                                <FormErrorMessage>{errors.payment_method?.message}</FormErrorMessage>
                            </FormControl>
                            <Flex mb={5} justifyContent={"center"} alignItems={"center"}>
                                {
                                    index > 0 &&
                                    <DeleteIcon
                                        color='red.200'
                                        cursor={"pointer"}
                                        _hover={{ color: "red.600" }}
                                        onClick={() => remove()}

                                    >
                                    </DeleteIcon>
                                }
                            </Flex>
                        </Flex>
                    ))}

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
                            (saleId ? 'Edit' : 'Create')}
                    </Button>
                    <Button
                        colorScheme='gray'
                        type="button"
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                </ButtonGroup>
            </form >
            <DevTool control={control} />
        </>
    )
}

export default SaleForm