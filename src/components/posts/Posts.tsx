import { Community } from "@/src/atoms/communitiesAtom";
import { Post } from "@/src/atoms/postAtom";
import { auth, firestore } from "@/src/firebase/ClientApp";
import usePosts from "@/src/hooks/usePosts";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { Stack, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import PostLoader from "./PostLoader";
import { json } from "stream/consumers";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [user] = useAuthState(auth);

  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const getPosts = async () => {
    setLoading(true);

    try {
      const postsQuery = query(
        collection(firestore, "posts"),
        where("communityId", "==", communityData?.id!),
        orderBy("createdAt", "desc")
      );

      const postDocs = await getDocs(postsQuery);
      const posts = postDocs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));

      console.log("post", posts);
    } catch (error: any) {
      console.log("getPosts error", error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      {loading ? (
        <PostLoader />
      ) : (
        <Stack>
          {postStateValue.posts.map((post: Post, index) => (
            <PostItem
              key={post.id}
              post={post}
              // postIdx={index}
              onVote={onVote}
              onDeletePost={onDeletePost}
              userVoteValue={
                postStateValue.postVotes.find((item) => item.postId === post.id)
                  ?.voteValue
              }
              userIsCreator={user?.uid === post.creatorId}
              onSelectPost={onSelectPost}
            />
          ))}
        </Stack>
      )}
    </>
  );
};
export default Posts;
