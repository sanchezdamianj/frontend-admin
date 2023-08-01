/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Flex, Spinner } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { createContext, type Dispatch, type ReactNode, type SetStateAction, useState, useEffect } from "react"
import { type TokenPayload } from "~/schemas/AuthSchema"

export interface IAuthContext {
    user: TokenPayload
    setUser: Dispatch<SetStateAction<TokenPayload>>

}
export const AuthContext = createContext<IAuthContext | null>(null)

const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<TokenPayload | null>(null)
    const [validating, setValidating] = useState(true)
    const router = useRouter()
    const PROTECTED_ROUTES = ['/']


    const validateRoutes = (user: TokenPayload) => {
        if (!!user && PROTECTED_ROUTES.includes(router.pathname)) {
            void router.push('/login')
        }
        if (!!user && router.pathname === '/login') {
            void router.push('/')
        }
        setTimeout(() => {
            setValidating(false)
        }, 100)
    }


    useEffect(() => {
        const userLS = localStorage.getItem("user")
        const userForState = !!userLS ? JSON.parse(userLS) : null
        setUser(userForState)
        validateRoutes(userForState)
    }, [])

    if (validating)
        return (
            <Flex
                width="30rem"
                height="30rem"
                margin="0 auto"
                alignItems="center"
                justifyContent="center"
            >
                <Spinner
                    colorScheme="purple"
                    color="purple.400"
                    width="3rem"
                    height="3rem"
                />
            </Flex>
        )
    return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export default AuthProvider;