/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */

import { SearchIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import axios from 'axios'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { env } from '~/env.mjs'
import { type Product } from '~/schemas/SalesSchema'

interface Props {
    index: number
}

export default function MySearchIcon({ index }: Props) {
    const { getValues, setValue } = useFormContext()
    return (
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
    )
}