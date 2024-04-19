import { Community, communityState } from "@/src/atoms/communitiesAtom";
import PageContent from "@/src/components/Layout/PageContent";
import About from "@/src/components/community/About";
import CommunityNotFound from "@/src/components/community/CommunityNotFound";
import CreatePostLink from "@/src/components/community/CreatePostLink";
import Header from "@/src/components/community/Header";
import Posts from "@/src/components/posts/Posts";
import { firestore } from "@/src/firebase/ClientApp";
import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  useEffect(() => {
    if (communityData) {
      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: communityData,
      }));
    }
  }, [communityData]);

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContent>
        {/* Left Content */}
        <>
          <CreatePostLink />
          <Posts communityData={communityData} />
        </>
        {/* Right Content */}
        <>
          <About communityData={communityData} />
        </>
      </PageContent>
    </>
  );
};
export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log("GET SERVER SIDE PROPS RUNNING");

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.community as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : "",
      },
    };
  } catch (error) {
    // Could create error page here
    console.log("getServerSideProps error - [community]", error);
  }
}
