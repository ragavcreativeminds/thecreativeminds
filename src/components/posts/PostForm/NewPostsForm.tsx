import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Icon,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BsArchive, BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";
import ImageUpload from "./ImageUpload";
import { User } from "firebase/auth";
import { useRouter } from "next/router";
import { Post } from "@/src/atoms/postAtom";
import { useUploadFile } from "react-firebase-hooks/storage";
import validUrl from "valid-url";
import imageCompression from "browser-image-compression";
import {
  Timestamp,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore, storage } from "@/src/firebase/ClientApp";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/src/hooks/useSelectFile";
import TextEditor from "./TextEditor";

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
    title: "Assets",
    icon: BsArchive,
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
    links: "",
  });

  const selectFileRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const {
    selectedFile,
    setSelectedFile,
    selectedFileUpload,
    setSelectedFileUpload,
    onSelectFile,
  } = useSelectFile();

  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();

  function processLinks(links: any) {
    try {
      // Split the links string into an array
      const linksArray = links.split(",");

      // Filter out invalid URLs
      const postLinks: string[] = linksArray
        .map((link: any) => String(link).trim()) // Convert each element to a string and trim whitespace
        .filter((link: string) => validUrl.isUri(link));

      return { success: true, postLinks };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  const handleCreatePost = async () => {
    setLoading(true);

    const { community } = router.query;
    const { title, body, links } = textInputs;

    try {
      // Validate title
      if (!title.trim()) throw new Error("Title cannot be empty");

      setError(""); // Clear any previous error

      const postLinkscheck = processLinks(links);

      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId: community as string,
        creatorId: user?.uid,
        userDisplayText: user?.email?.split("@")[0] || "", // handle potential null or undefined
        title,
        body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp() as Timestamp,
        editedAt: serverTimestamp() as Timestamp,
      });

      console.log("New Post ID:", postDocRef.id);

      if (postLinkscheck.success && postLinkscheck.postLinks?.length) {
        await updateDoc(postDocRef, { links: postLinkscheck.postLinks });
        console.log("Post Links URL:", postLinkscheck.postLinks);
      }

      if (selectedFileUpload) {
        const compressedImagePromise = getCompressedImage(selectedFileUpload);
        const compressedImage = await compressedImagePromise;

        if (compressedImage) {
          const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
          await uploadFile(imageRef, compressedImage);
          const downloadURL = await getDownloadURL(imageRef);
          await updateDoc(postDocRef, { imageURL: downloadURL });
          console.log("Download URL:", downloadURL);
        }
      }

      router.back();
    } catch (error: any) {
      console.error("Error creating post:", error.message);
      setError(error.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  const getCompressedImage = async (file: any) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    if (file) {
      const fileSize = file.size / 1024 / 1024;

      if (fileSize > 10) {
        throw new Error("Oops! Image exceeds 10MB limit.");
      } else {
        const compressedFile = await imageCompression(file, options);
        console.log(
          "compressedFile instanceof Blob",
          compressedFile instanceof Blob
        ); // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB

        return compressedFile;
      }
    }
  };

  // const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const reader = new FileReader();
  //   if (event.target.files?.[0]) {
  //     reader.readAsDataURL(event.target.files[0]);
  //   }

  //   reader.onload = (readerEvent) => {
  //     if (readerEvent.target?.result) {
  //       setSelectedFile(readerEvent.target?.result as string);
  //     }
  //   };
  // };

  const onTitleChange = (title: string) => {
    setTextInputs((prev) => ({
      ...prev,
      title: title,
    }));
  };

  const onLinkChange = (link: string) => {
    setTextInputs((prev) => ({
      ...prev,
      links: link,
    }));
  };

  const onBodyTextChange = (body: string) => {
    setTextInputs((prev) => ({
      ...prev,
      body: body,
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
        <Flex p={2} width="100%">
          <TextInputs
            textInput={textInputs.title}
            onChange={onTitleChange}
            height="25px"
            placeHolder="Title"
          />
        </Flex>
        <Flex p={2}>
          {selectedTab === "Post" && (
            <TextEditor
              textInput={textInputs.body}
              onChange={onBodyTextChange}
              readonly={false}
              theme="snow"
              height="300px"
              placeHolder="Description (Optional)"
            />
          )}
          {selectedTab === "Images & Video" && (
            <ImageUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              selectedFileUpload={selectedFileUpload}
              setSelectedFileUpload={setSelectedFileUpload}
              setSelectedTab={setSelectedTab}
              selectFileRef={selectFileRef}
              onSelectImage={onSelectFile}
            />
          )}
          {selectedTab === "Link" && (
            <TextInputs
              textInput={textInputs.links}
              onChange={onLinkChange}
              height="300px"
              placeHolder="Links (Seperated by commas)"
            />
          )}
        </Flex>
        <Flex p={2} mt={10} justify="flex-end">
          <Button
            height="34px"
            padding="0px 30px"
            disabled={!textInputs.title}
            isLoading={loading}
            onClick={handleCreatePost}
          >
            Post
          </Button>
        </Flex>
        {error && (
          <Alert status="error">
            <AlertIcon />
            <Text mr={2}>{error}</Text>
          </Alert>
        )}
      </Flex>
    </>
  );
};
export default NewPostsForm;
