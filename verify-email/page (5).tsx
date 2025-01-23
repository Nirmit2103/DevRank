"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Layout from "../components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAuth, sendSignInLinkToEmail } from "firebase/auth"
import { initializeApp } from "firebase/app"

// Initialize Firebase (make sure to add your Firebase config)
const firebaseConfig = {
  // Your Firebase configuration
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function VerifyEmail() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.endsWith(".edu")) {
      setMessage("Please use a valid college email address.")
      return
    }

    try {
      await sendSignInLinkToEmail(auth, email, {
        url: "http://localhost:3000/complete-signup",
        handleCodeInApp: true,
      })
      window.localStorage.setItem("emailForSignIn", email)
      setMessage("Verification email sent. Please check your inbox.")
    } catch (error) {
      console.error("Error sending verification email:", error)
      setMessage("An error occurred. Please try again.")
    }
  }

  return (
    <Layout>
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>Please enter your college email address to verify your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Your college email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit">Send Verification Email</Button>
          </form>
          {message && <p className="mt-4 text-center">{message}</p>}
        </CardContent>
      </Card>
    </Layout>
  )
}

