import React, { useState } from "react";
import CreateCommunityModal from "../../Modal/CreateCommunity/CreateCommunityModal";
import { Flex, Icon, MenuItem } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/ClientApp";

type CommunitiesProps = {};

const Communities: React.FC<CommunitiesProps> = () => {
  const [open, setOpen] = useState(false);
  const [user] = useAuthState(auth);
  return (
    <>
      <CreateCommunityModal
        isOpen={open}
        handleClose={() => setOpen(false)}
        userId={user?.uid}
      />
      <MenuItem
        width="100%"
        fontSize="10pt"
        _hover={{ bg: "gray.100" }}
        onClick={() => setOpen(true)}
      >
        <Flex alignItems="center">
          <Icon fontSize={20} mr={2} as={GrAdd} />
          Create Community
        </Flex>
      </MenuItem>
    </>
  );
};
export default Communities;
