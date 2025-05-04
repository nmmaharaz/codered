"use client";
import { Button } from "@/components/ui/button";
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname, useRouter} from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useRef, useState } from "react";
import profilePic from "@/public/assets/profile-pic.png";
import RichTextEiditor from "@/app/components/rich-text-eiditor/index";
// import RichTextEiditor from "@/components/rich-text-eiditor";
// import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";

export default function GroupPost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedPostType, setSelectedPostType] = useState("blog");
  const [editorContent, setEditorContent] = useState("");
  const [imageContent, setImageContent] = useState([]);
  const pathname = usePathname();
  const group_user_name = pathname.split("/")[2];
  const { register, handleSubmit, reset } = useForm();
  const drawerCloseRef = useRef(null);
  const onSubmit = async (data) => {
    try {
      const userQuery = {
        group_user_name: group_user_name,
        name: session?.user?.name,
        email: session?.user?.email,
        image: session?.user?.image,
        content: editorContent,
        contentImage: imageContent,
        postType: data.postType,
        postedAt: new Date(),
        comments: [],
        likes: [],
        dislikes: [],
      };
      const apiEndpoint = "/api/community/post";

      const { data: dataPost } = await axios.post(apiEndpoint, userQuery);
      if (dataPost.acknowledged === true) {
        reset();
        toast.success(`Your ${data?.postType} posted successfully`);
        // router.push(pathname);
        if (drawerCloseRef.current) {
          drawerCloseRef.current.click();
        }
      } else {
        toast.error("Failed to post your content");
      }
    } catch (error) {
      console.error("Error posting:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <DrawerContent className=" bg-gray-900 text-white rounded-lg overflow-hidden">
      <div className="overflow-y-auto max-h-[75vh] px-2">
        <DrawerHeader>
          <DrawerTitle className="text-lg text-white text-center font-semibold">
            Create a Post
          </DrawerTitle>
          <DrawerDescription className="text-gray-400 text-center">
            Write your blog or ask a question.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex justify-center items-center space-x-3 p-4">
          <Image
            src={session?.user?.image || profilePic}
            width={40}
            height={40}
            alt="User Profile"
            className="rounded-full border border-blue-500"
          />
          <div>
            <p className="font-medium">{session?.user?.name}</p>
          </div>
        </div>

        <div>
          <RichTextEiditor
            setContent={setEditorContent}
            setImageContent={(imageContent) =>
              setImageContent(
                Array.isArray(imageContent) ? imageContent : [imageContent]
              )
            }
          />
        </div>
      </div>
      <DrawerFooter className="px-4">
        {selectedPostType && (
          <Button
            className={` w-[200px] md:w-xl mx-auto py-2 rounded-lg cursor-pointer ${
              selectedPostType === "blog"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            onClick={handleSubmit(onSubmit)}
          >
            {selectedPostType === "blog" ? "Post Blog" : "Ask Question"}
          </Button>
        )}

        <DrawerClose asChild>
          <Button
            ref={drawerCloseRef}
            className="w-[200px] md:w-xl mx-auto py-2 mt-2 bg-red-600 hover:bg-red-700"
          >
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  );
}
