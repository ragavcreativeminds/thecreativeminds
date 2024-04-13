import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import SearchInput from "./SearchInput";
import RightContent from "./Rightcontent/RightContent";
import AuthModal from "../Modal/Auth/AuthModal";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/ClientApp";
import Directory from "./Directory/Directory";

type NavbarProps = {};

const Navbar: React.FC<NavbarProps> = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <>
      <Flex
        bg="white"
        height={"44px"}
        padding={"6px 12px"}
        justify={{ md: "space-between" }}
      >
        <Flex
          align={"center"}
          width={{ base: "40px", md: "auto" }}
          mr={{ base: 0, md: 2 }}
        >
          <Image src="/images/redditFace.svg" height={"30px"} />
          <Image
            src="/images/redditText.svg"
            height={"46px"}
            display={{ base: "none", md: "unset" }}
          />
        </Flex>
        {user && <Directory />}
        <SearchInput user={user} />
        <AuthModal user={user} />
        <RightContent user={user} />
      </Flex>
    </>
  );
};
export default Navbar;
