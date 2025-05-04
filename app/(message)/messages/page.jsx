"use client";

import Skeleton from "@/messages/components/ui/Skeleton";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/messages/chats");
  }, [router]);

  return (
    <Skeleton />
  );

};

export default HomePage;
