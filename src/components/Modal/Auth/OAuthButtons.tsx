import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  useAuthState,
  useSignInWithApple,
  useSignInWithFacebook,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/ClientApp";
import { User } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

type OAuthButtonsProps = {};

const OAuthButtons: React.FC<OAuthButtonsProps> = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const [
    signInWithFacebook,
    userCredFacebook,
    facebook_loading,
    facebook_error,
  ] = useSignInWithFacebook(auth);

  const creatUserDocument = async (user: User) => {
    const userDocRef = doc(firestore, "users", user.uid);
    setDoc(userDocRef, JSON.parse(JSON.stringify(user)));
  };

  useEffect(() => {
    if (userCred) {
      creatUserDocument(userCred.user);
    }
  }, [userCred]);

  useEffect(() => {
    if (userCredFacebook) {
      creatUserDocument(userCredFacebook.user);
    }
  }, [userCredFacebook]);

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
          isLoading={facebook_loading}
          onClick={() => signInWithFacebook()}
        >
          <Image src="/images/applelogo.png" height={"40px"} mr={4}></Image>
          Continue with Facebook
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
