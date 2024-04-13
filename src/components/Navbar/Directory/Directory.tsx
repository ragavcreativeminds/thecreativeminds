import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Flex, Icon, MenuList, Text } from "@chakra-ui/react";
import { Box } from "framer-motion";
import React from "react";
import { FaRedditSquare } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { VscAccount } from "react-icons/vsc";
import Communities from "./Communities";

type DirectoryProps = {};

const Directory: React.FC<DirectoryProps> = () => {
  return (
    <Menu>
      <MenuButton
        cursor={"pointer"}
        padding={"0px 6px"}
        borderRadius={4}
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "grey.200" }}
      >
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width={{ base: "auto", lg: "200px" }}
        >
          <Flex align={"center"}>
            <Icon fontSize={24} mr={{ base: 1, md: 2 }} as={TiHome} />
            <Flex display={{ base: "none",md:'flex' }}>
              <Text fontWeight={600} fontSize={"10pt"}>
                Home
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities/>
      </MenuList>
    </Menu>
  );
};
export default Directory;
