"use client";
import { useLayoutEffect } from "react";
import { useRouter } from "next/navigation";

export default function withAuth(Component) {
  return function ProtectedRoute(props) {
    const router = useRouter();

    useLayoutEffect(() => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
        }
      }
    }, [router]);

    return <Component {...props} />;
  };
}
