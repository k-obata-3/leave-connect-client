"use client"

import { useEffect } from "react";

import { useNotificationMessageStore } from "@/store/notificationMessageStore";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { clearNotificationMessageObject } = useNotificationMessageStore();

  useEffect(() =>{
    clearNotificationMessageObject();
  }, [])

  return (
    <>
      {children}
    </>
  )
}
