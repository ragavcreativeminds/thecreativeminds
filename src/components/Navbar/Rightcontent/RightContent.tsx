import { Button, Flex } from "@chakra-ui/react";
import React from "react";
import AuthButtons from "./AuthButtons";
import { User, signOut } from "firebase/auth";
import { auth } from "@/src/firebase/ClientApp";
import ActionIcons from "./Icons";
import AuthModal from "../../Modal/Auth/AuthModal";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal user={user} />
      <Flex justifyContent="center" alignItems="center">
        {user ? <ActionIcons /> : <AuthButtons />}
        <UserMenu user={user}></UserMenu>
      </Flex>
    </>
  );
};
export default RightContent;
