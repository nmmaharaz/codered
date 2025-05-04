'use server'

import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
import bcrypt from "bcryptjs"

export const loginUser = async (data) => {
  const { email, password } = data
  const userCollection = dbConnect(collectionNameObj.userCollection)
  
  const user = await userCollection.findOne({ email })
  if (!user) {
    return { error: "Invalid credentials" }
  }

  if (user.loginAction === "block") {
    return { error: "Account is locked. Please use forgot password to unlock." }
  }

  const isPassOk = await bcrypt.compare(password, user.password)
  if (!isPassOk) {
    const newAttempts = (user.failedLoginAttempts || 0) + 1
    const updateData = {
      failedLoginAttempts: newAttempts,
      lastFailedLogin: new Date(),
    }

    if (newAttempts >= 4) {
      updateData.loginAction = "block"
    }

    await userCollection.updateOne(
      { email },
      { $set: updateData }
    )

    return { error: "Invalid credentials" }
  }

  await userCollection.updateOne(
    { email },
    {
      $set: {
        failedLoginAttempts: 0,
        lastFailedLogin: null,
        loginAction: "unblock",
      },
    }
  )

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    image: user.image,
  }
}