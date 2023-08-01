/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ButtonGroup, Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { env } from "../../../env.mjs";
import React from "react";
import { useFormContext } from "react-hook-form";
import { CheckIcon } from "@chakra-ui/icons";

const LoginButton = () => {
    const toast = useToast()
    const { getValues } = useFormContext()
    return (
        <ButtonGroup>
            <Button
                type="submit" colorScheme="purple"
            >Log in
            </Button>
            <Button onClick={() => {
                const email = getValues("email")
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}/code`)
                    .then(({ data }) => toast({ description: data?.message, status: "success", icon: <CheckIcon /> }))
                    .catch(() => console.log("ok"))
            }}>
                I need a code
            </Button>
        </ButtonGroup>
    )
}

export default LoginButton