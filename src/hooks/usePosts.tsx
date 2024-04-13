import React from "react";
import { Post, postState } from "../atoms/postAtom";
import { useRecoilState } from "recoil";

type usePostsProps = {};

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async () => {};

  const onDeletePost = async (post: Post) => {};

  return {
    postStateValue,
    setPostStateValue,
  };
};
export default usePosts;
