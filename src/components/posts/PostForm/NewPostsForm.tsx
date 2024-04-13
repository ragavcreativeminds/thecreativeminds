import { Alert, AlertIcon, Flex, Icon, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BiPoll } from "react-icons/bi";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";
import ImageUpload from "./ImageUpload";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { Post } from "@/src/atoms/postAtom";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/src/firebase/ClientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

type NewPostsFormProps = {
  user: User;
};

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabI = {
  title: string;
  icon: typeof Icon.arguments;
};

const NewPostsForm: React.FC<NewPostsFormProps> = ({ user }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
  });
  const [selectedFile, setSelectedFile] = useState<string>();

  const selectFileRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {

    setLoading(true);

    const { community } = router.query;

    const { title, body } = textInputs;

    try {
      // create post
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId: community as string,
        creatorId: user?.uid,
        userDisplayText: user.email!.split("@")[0],
        title,
        body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
        editedAt: serverTimestamp() as Timestamp,
        id: "",
      });

      console.log("HERE IS NEW POST ID", postDocRef.id);

      // // check if selectedFile exists, if it does, do image processing

      // check if file added
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);

        // update downloadURL in post
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
        console.log("HERE IS DOWNLOAD URL", downloadURL);
      }

      router.back()
    } catch (error) {
      console.log("createPost error", error);
      setError("Error creating post");
    }

    setLoading(false);
  };

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Flex direction="column" bg="white" borderRadius={4} mt={2}>
        <Flex width="100%">
          {formTabs.map((item, index) => (
            <TabItem
              key={index}
              item={item}
              selected={item.title === selectedTab}
              setSelectedTab={setSelectedTab}
            />
          ))}
        </Flex>
        <Flex p={4}>
          {selectedTab === "Post" && (
            <TextInputs
              textInputs={textInputs}
              onChange={onTextChange}
              handleCreatePost={handleCreatePost}
              loading={loading}
            />
          )}
          {selectedTab === "Images & Video" && (
            <ImageUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              setSelectedTab={setSelectedTab}
              selectFileRef={selectFileRef}
              onSelectImage={onSelectImage}
            />
          )}
        </Flex>
        {error && (
          <Alert status="error">
            <AlertIcon/>
            <Text mr={2}>{error}</Text>
          </Alert>
        )}
      </Flex>
    </>
  );
};
export default NewPostsForm;
