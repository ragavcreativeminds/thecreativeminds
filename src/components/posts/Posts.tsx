import { Community } from "@/src/atoms/communitiesAtom";
import { Post } from "@/src/atoms/postAtom";
import { firestore } from "@/src/firebase/ClientApp";
import usePosts from "@/src/hooks/usePosts";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import { Stack } from "@chakra-ui/react";

type PostsProps = {
  communityData: Community;
};

const Posts: React.FC<PostsProps> = ({ communityData }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { postStateValue, setPostStateValue } = usePosts();

  const getPosts = async () => {
    console.log("WE ARE GETTING POSTS!!!");

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
    <Stack>
      {postStateValue.posts.map((post: Post, index) => (
        <PostItem key={index} post={post} />
      ))}
    </Stack>
  );    
};
export default Posts;
