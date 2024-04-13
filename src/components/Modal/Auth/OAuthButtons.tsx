import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  useAuthState,
  useSignInWithApple,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/ClientApp";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const [signInWithApple, userCredApple, loading_, error_] =
    useSignInWithApple(auth);

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
    <>
      <Flex direction={"column"} width={"100%"} mb={4}>
        <Button
          variant={"oauth"}
          mb={2}
          isLoading={loading}
          onClick={() => signInWithGoogle()}
        >
          <Image src="/images/googlelogo.png" height={"20px"} mr={4}></Image>
          Continue with Google
        </Button>
        <Button
          variant={"oauth"}
          mb={2}
          isLoading={loading_}
          onClick={() => signInWithApple()}
        >
          <Image src="/images/applelogo.png" height={"40px"} mr={4}></Image>
          Continue with Apple
        </Button>
        {error && (
          <Text textAlign="center" fontSize="10pt" color="red" mt={2}>
            {error.message}
          </Text>
        )}
      </Flex>
    </>
  );
};
export default OAuthButtons;
