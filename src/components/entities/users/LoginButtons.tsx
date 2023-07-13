/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ButtonGroup, Button } from "@chakra-ui/react";
import axios from "axios";
import { env } from "../../../env.mjs";
import React from "react";
import { useFormContext } from "react-hook-form";

const LoginButton = () => {
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
                void axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}/code`)
            }}>
                I need a code
            </Button>
        </ButtonGroup>
    )
}

export default LoginButton