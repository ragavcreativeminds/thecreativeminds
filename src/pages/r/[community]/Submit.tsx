import React from "react";
import PageContent from "@/src/components/Layout/PageContent";
import { Box, Text } from "@chakra-ui/react";
import NewPostsForm from "@/src/components/posts/PostForm/NewPostsForm";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/src/firebase/ClientApp";
import { communityState } from "@/src/atoms/communitiesAtom";
import { useRecoilValue } from "recoil";

type SubmitProps = {};

const Submit: React.FC<SubmitProps> = () => {
  const [user, loadingUser, error] = useAuthState(auth);
  const communityStateValue = useRecoilValue(communityState);
  return (
    <PageContent>
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
          {user && <NewPostsForm user={user} />}
        </Box>
      </>
      <></>
    </PageContent>
  );
};
export default Submit;
