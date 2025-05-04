"use client"
import axios from "axios"
import { useEffect, useState } from "react"

function useGroupUserInfo(path, email) {
    const [userInfo, setUserInfo] = useState([])
    useEffect(()=>{
       const GroupUser =async()=>{
           if(email){
               const {data} = await axios(`/api/community/${email}`, {
                headers: { path },
            })
               setUserInfo(data)
           }
       }
       GroupUser()
    },[email, path])
  return userInfo
}

export default useGroupUserInfo