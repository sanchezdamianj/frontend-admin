/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import {
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  FormErrorMessage,
  Heading,
  Input,
  Card,
  ButtonGroup,
  Button
} from "@chakra-ui/react";
import { useForm } from 'react-hook-form'
import axios from "axios";
import { env } from "~/env.mjs";
import { useRouter } from "next/router"
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email("Email format invalid"),
  code: z.string().length(6, "The code must contain 6 numbers")
})

type FieldValues = z.infer<typeof schema>
// interface FieldValues {
//   code: string,
//   email: string
// }

const Login: NextPage = () => {
  const { register, getValues, handleSubmit, formState: { errors } } = useForm<FieldValues>({ resolver: zodResolver(schema) })

  const router = useRouter()

  const onSubmit = () => {
    const { email, code } = getValues()
    console.log({ email, code })

    axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}`, { code })
      .then(() => router.push("/"))
      .catch(console.log)
  }

  const onError = () => {
    console.log({ errors })
  }


  return (
    <Container marginTop={10} colorScheme="grey">
      <Heading textAlign={"center"}>Log in</Heading>
      <Card justifyContent={"center"}>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <FormControl marginBottom={5} isInvalid={!!errors.email}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="text"
              placeholder="Enter your email"
              {...register("email")}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            <FormHelperText>We ll never share your email.</FormHelperText>
          </FormControl>

          <FormControl marginBottom={5} isInvalid={!!errors.code}>
            <FormLabel>Code</FormLabel>
            <Input
              type="text"
              placeholder="Enter your code"
              {...register("code")}
            />
            <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
          </FormControl>

          <ButtonGroup>
            <Button
              type="submit"
            >Log in
            </Button>

            <Button onClick={async () => {
              const { email } = getValues()
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              await axios.post(`${env.NEXT_PUBLIC_BACKEND_BASE_URL}/auth/login/${email}/code`)
            }}>
              I need a code
            </Button>
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </ButtonGroup>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
