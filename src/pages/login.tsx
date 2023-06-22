/* eslint-disable @typescript-eslint/no-misused-promises */
import { type NextPage } from "next";
import {
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Card,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { useForm } from 'react-hook-form'


const Login: NextPage = () => {
  const { register, getValues } = useForm()
  const { name, onBlur, onChange, ref } = register("email")

  return (
    <Container marginTop={10} colorScheme="grey">
      <Heading textAlign={"center"}>Log in</Heading>
      <Card justifyContent={"center"}>
        <form>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              type="text"
              placeholder="Enter your email"
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
            />
            <FormHelperText>We ll never share your email.</FormHelperText>
            <FormLabel>Code</FormLabel>
            <Input type="text" placeholder="Enter your email" />
          </FormControl>
          <ButtonGroup>
            <Button onClick={() => console.log(getValues())}>Log in</Button>
            <Button>I need a code</Button>
          </ButtonGroup>
        </form>
      </Card>
    </Container>
  );
};

export default Login;
