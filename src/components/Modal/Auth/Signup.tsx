import { authModalState } from "@/src/atoms/authModalAtom";
import { Input, Button, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/ClientApp";
import { FIREBASE_ERRORS } from "@/src/firebase/errors";
import { User } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
type SignupProps = {};

const Signup: React.FC<SignupProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const [signUpForm, setsignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (error) setError("");
    if (signUpForm.password != signUpForm.confirmPassword) {
      setError("Password does not match");
      return;
    }

    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update from state
    setsignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // const creatUserDocument = async (user: User) => {
  //   await addDoc(
  //     collection(firestore, "users"),
  //     JSON.parse(JSON.stringify(user))
  //   );
  // };

  // useEffect(() => {
  //   if (userCred) {
  //     creatUserDocument(userCred.user);
  //   }
  // }, [userCred]);

  const creatUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) {
      creatUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
      <Input
        required
        name="password"
        placeholder="password"
        type="password"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
      <Input
        required
        name="confirmPassword"
        placeholder="confirm password"
        type="password"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          border: "1px solid",
          borderColor: "blue.500",
        }}
      />
      <Text textAlign="center" mt={2} fontSize="10pt" color="red">
        {error ||
          FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          LOG IN
        </Text>
      </Flex>
    </form>
  );
};
export default Signup;
