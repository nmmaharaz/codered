'use server'

import dbConnect, { collectionNameObj } from "@/lib/dbConnect"
import bcrypt from "bcryptjs"

export const resetPassword = async (email, token, newPassword) => {
  try {
    const userCollection = dbConnect(collectionNameObj.userCollection)
    const userBefore = await userCollection.findOne({ email })
    const user = await userCollection.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    })

    if (!user) {
      console.error(`Reset password failed: No user found with email=${email}, token=${token}, or token expired`)
      return { error: "Invalid or expired token" }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the user document
    const updateResult = await userCollection.updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          failedLoginAttempts: 0,
          loginAction: "unblock",
          lastFailedLogin: null,
          resetToken: null,
          resetTokenExpiry: null,
        },
      }
    )


    if (updateResult.modifiedCount === 0) {
      console.error(`Reset password failed: No document modified for email=${email}`)
      return { error: "Failed to update password" }
    }

    // Log the user state after the update
    const userAfter = await userCollection.findOne({ email })
    return { success: "Password reset successful" }
  } catch (error) {
    console.error(`Reset password error for email=${email}:`, error)
    return { error: "An error occurred while resetting the password" }
  }
}