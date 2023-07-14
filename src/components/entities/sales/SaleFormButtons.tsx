import { Button, ButtonGroup } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'

interface Props {
    saleId: string | undefined
}

export default function SaleFormButtons({ saleId }: Props) {
    const router = useRouter()
    return (
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
    )
}