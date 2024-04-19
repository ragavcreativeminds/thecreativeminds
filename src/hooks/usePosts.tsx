import { Post, PostVote, postState } from "../atoms/postAtom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { deleteObject, ref } from "firebase/storage";
import { auth, firestore, storage } from "../firebase/ClientApp";
import { collection, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { authModalState } from "../atoms/authModalAtom";

type usePostsProps = {};

const usePosts = () => {
  const [user, loadingUser] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onVote = async (
    //  event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    vote: number,
    communityId: string
  ) => {
    // event.stopPropagation();

    // user not logged ask to login
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    const { voteStatus } = post;

    // existing vote status
    const existingVote = postStateValue.postVotes.find(
      (vote) => vote.postId === post.id
    );

    console.log("existingVote" + existingVote);

    try {
      let voteChange = vote;
      const batch = writeBatch(firestore);

      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostvotes = [...postStateValue.postVotes];

      // New vote
      if (!existingVote) {
        const postVoteRef = doc(
          collection(firestore, "users", `${user.uid}/postVotes`)
        );

        const newVote: PostVote = {
          id: postVoteRef.id,
          postId: post.id,
          communityId,
          voteValue: vote,
        };

        console.log("NEW VOTE!!!", newVote);

        batch.set(postVoteRef, newVote);

        updatedPost.voteStatus = voteStatus + vote;
        updatedPostvotes = [...updatedPostvotes, newVote];
      } else {
        // Existing vote - they have vote before on post

        // Used for both possible cases of batch writes
        const postVoteRef = doc(
          firestore,
          "users",
          `${user.uid}/postVotes/${existingVote.id}`
        );

        if (existingVote.voteValue === vote) {
          voteChange *= -1;
          console.log("vote change" + voteChange);
          // Removing their vote (top = neutral) or (down = neutral)
          // add/subtract 1 to/from post.voteStatus
          updatedPost.voteStatus = voteStatus - vote;
          updatedPostvotes = updatedPostvotes.filter(
            (vote) => vote.id !== existingVote.id
          );
          // delete the postVote document
          batch.delete(postVoteRef);
        } else {
          // flipping their vote (up => down OR down => up)
          voteChange = 2 * vote;
          updatedPost.voteStatus = voteStatus + 2 * vote;
          // add/subtract 2 to/from post.voteStatus
          // updating the existing postVote document
          const voteIdx = postStateValue.postVotes.findIndex(
            (vote) => vote.id === existingVote.id
          );

          console.log("HERE IS VOTE INDEX", voteIdx);

          // Vote was found - findIndex returns -1 if not found
          if (voteIdx !== -1) {
            updatedPostvotes[voteIdx] = {
              ...existingVote,
              voteValue: vote,
            };
          }
          batch.update(postVoteRef, {
            voteValue: vote,
          });
        }
        //
      }
      const postRef = doc(firestore, "posts", post.id);
      batch.update(postRef, { voteStatus: voteStatus + voteChange });
      await batch.commit();

      let updatedState = { ...postStateValue, postVotes: updatedPostvotes };

      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );

      updatedPosts[postIdx!] = updatedPost;

      updatedState = {
        ...updatedState,
        posts: updatedPosts,
      };

      // setPostStateValue((prev) => ({
      //   ...prev,
      //   posts: updatedPosts,
      //   postVotes: updatedPostvotes,
      // }));
      console.log(updatedState);
      setPostStateValue(updatedState)
    } catch (error: any) {
      console.log("onVote error", error);
    }
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    console.log("DELETING POST: ", post.id);

    try {
      // if post has an image url, delete it from storage
      if (post.imageURL) {
        console.log("postid" + post.id);
        const imageRef = ref(storage, `posts/${post.id}/image`);
        console.log(imageRef);
        await deleteObject(imageRef);
      }

      // delete post from posts collection
      const postDocRef = doc(firestore, "posts", post.id);
      await deleteDoc(postDocRef);

      // Update post state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));

      /**
       * Cloud Function will trigger on post delete
       * to delete all comments with postId === post.id
       */
      return true;
    } catch (error) {
      console.log("THERE WAS AN ERROR", error);
      return false;
    }
  };

  const onSelectPost = () => {};

  return {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  };
};
export default usePosts;
