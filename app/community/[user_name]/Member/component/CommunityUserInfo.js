"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGroupInfo = (endPoint) => {
  const { data = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["GroupInfo", endPoint],
    queryFn: async () => {
      const res = await axios.get(`/api/communities/${endPoint}`);
      return res.data;
    },
  });
  return { data, isLoading, isError, refetch };
};

