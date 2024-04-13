import { Post } from "@/src/atoms/postAtom";
import { Box, Flex, Text } from "@chakra-ui/react";
import { NextRouter } from "next/router";
import React from "react";

type PostItemProps = {
  post: Post;
  //   onVote: (
  //     event: React.MouseEvent<SVGElement, MouseEvent>,
  //     post: Post,
  //     vote: number,
  //     communityId: string,
  //     postIdx?: number
  //   ) => void;
  //   onDeletePost: (post: Post) => Promise<boolean>;
  //   userIsCreator: boolean;
  //   onSelectPost?: (value: Post, postIdx: number) => void;
  //   router?: NextRouter;
  //   postIdx?: number;
  //   userVoteValue?: number;
  //   homePage?: boolean;
};

const PostItem: React.FC<PostItemProps> = ({
  post,
  // postIdx,
  // onVote,
  // onSelectPost,
  // router,
  // onDeletePost,
  // userVoteValue,
  // userIsCreator,
  // homePage,
}) => {
  return (
    <>
      <Flex
        border="1px solid"
        bg="white"
        pr={4}
        borderColor={"gray.300"}
        borderRadius={"4px 4px 0px 0px"}
        cursor={"pointer"}
        _hover={"gray.500"}
      >
        <Box>
          <Text m={4}>Title: {post?.title}</Text>
          <Text p={4}>Description: {post?.body}</Text>
        </Box>
      </Flex>
    </>
  );
};
export default PostItem;
