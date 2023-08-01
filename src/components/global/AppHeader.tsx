import { Avatar, Button, Flex } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React from 'react'
import useAuth from 'hooks/useAuth'

export const AppHeader = () => {
    const { user, setUser } = useAuth()
    const router = useRouter()
    return (
        <Flex justifyContent={"space-between"} alignItems={"center"} mb={6}>
            <Avatar src="/react.svg" size="lg" />
            {!user && (
                <Button
                    colorScheme="green"
                    onClick={() => {
                        void router.push("/login");
                    }}
                >
                    Login
                </Button>
            )}

            {
                !!user &&
                <Flex gap={4} justifyContent={"center"} alignItems={"center"}>
                    <Avatar src={user?.imageURL} size="md" />
                    <Button
                        variant="ghost"
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                            localStorage.removeItem("user")
                            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                            setUser(null)
                            void router.push("/login");
                        }}
                    >
                        Log out
                    </Button>
                </Flex>
            }
        </Flex >
    )
}