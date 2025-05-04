import { loginUser } from "@/app/actions/auth/loginUser"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import dbConnect, { collectionNameObj } from "./dbConnect"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Enter your email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error("Credentials are missing")
        }

        const result = await loginUser(credentials)

        if (result.error) {
          throw new Error(result.error)
        }

        if (result) {
          return {
            id: result.id || "",
            name: result.name,
            email: result.email,
            image: result.image,
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent", // Forces consent screen to ensure refresh token is provided
          access_type: "offline", // Ensures refresh token is returned
          response_type: "code",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email", // Request access to user's email and profile
        },
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        console.warn(`User ${user.name} logged in via ${account?.provider} without an email.`);
        // return false
      }

      if (account?.provider !== "credentials") {
        const userCollection = dbConnect(collectionNameObj.userCollection)
        const isExisted = await userCollection.findOne({
          providerAccountId: account?.providerAccountId,
        })

        if (!isExisted) {
          await userCollection.insertOne({
            providerAccountId: account?.providerAccountId,
            provider: account?.provider,
            email: user.email || null,
            image: user.image,
            name: user.name,
            failedLoginAttempts: 0,
            loginAction: "unblock",
            lastFailedLogin: null,
          })
        }
      }

      return true
    },
    async redirect({ url, baseUrl, redirect_uri}) {
      // Ensure redirect stays within the app's base URL
      if (url.startsWith("/")) {
        return `${baseUrl}${url}${redirect_uri}`; // Redirect to the base URL with the path
      }
      return baseUrl; // Redirect to the base URL (NEXTAUTH_URL) after login
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}