/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import {
  Container,
  Heading,
  Card,
  useToast,
} from "@chakra-ui/react";
import axios, { AxiosError } from "axios";
import { env } from "~/env.mjs";
import { useRouter } from "next/router"
import MyForm from "~/components/ui/forms/MyForm";
import MyInput from "~/components/ui/inputs/MyInput";
import LoginButton from "~/components/entities/users/LoginButtons";
import { Login, LoginSchema } from "~/schemas/AuthSchema";
import useAuth from "hooks/useAuth";

const Login: NextPage = () => {
  const router = useRouter()
  const { setUser } = useAuth()
  const toast = useToast()

  const onSubmit = (data: Login) => {
    const { email, code } = data
    axios.post(
      `${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}`,
      { code },
      { withCredentials: true }
    )
      .then(({ data }) => {
        const tokenPayload = data.data
        localStorage.setItem("user", JSON.stringify(data?.data))
        setUser(tokenPayload)
        void router.push("/")
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          if (error?.response?.status === 400) {
            toast({
              title: error.response.data.message,
              status: "warning",
              position: "top",
            })
          } else {
            toast({
              title: "Error de servidor",
              description: error.message,
              status: "error",
              position: "top",
            })
          }
        }
      }
      )
  }

  const onError = (errors: unknown) => {
    console.log({ errors })
  }

  return (
    <Container marginTop={10} colorScheme="grey">
      <Heading textAlign={"center"} mb={4}>Log in</Heading>
      <Card justifyContent={"center"}>
        <MyForm zodSchema={LoginSchema} onSubmit={onSubmit} onError={onError} defaultValues={{ email: 'tecnopelasap@gmail.com' }}>
          <MyInput fieldName="email" label="email" placeholder="email" />
          <MyInput fieldName="code" label="code" placeholder="code" />
          <LoginButton />
        </MyForm>
      </Card>
    </Container>
  );
};

export default Login;
