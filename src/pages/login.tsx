/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import {
  Container,
  Heading,
  Card,
} from "@chakra-ui/react";
import axios from "axios";
import { env } from "~/env.mjs";
import { useRouter } from "next/router"
import MyForm from "~/components/ui/forms/MyForm";
import MyInput from "~/components/ui/inputs/MyInput";
import LoginButton from "~/components/entities/users/LoginButtons";
import { Login, LoginSchema } from "~/schemas/AuthSchema";

const Login: NextPage = () => {
  const router = useRouter()

  const onSubmit = (data: Login) => {
    const { email, code } = data
    axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}`, { code })
      .then(() => router.push("/"))
      .catch((error) => console.log(error))
  }

  const onError = (errors: any) => {
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
