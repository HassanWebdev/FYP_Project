"use client";
import { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "../../lib/axioshttp";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  useEffect(() => {
    // Check if already logged in
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        router.push("/");
      }
    }
  }, [router]);

  const onFinish = async (values) => {
    try {
      // Validate form fields
      await form.validateFields();
      setLoading(true);

      const response = await axios.post(process.env.NEXT_PUBLIC_API_URL + "/Auth/login", values);
      const data = response.data;

      // Store token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      message.success("Login successful!");
      router.push("/"); // Redirect to dashboard after successful login
    } catch (error) {
      message.error(error.response?.data?.error || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center !bg-[#0F172A] p-4">
      <div className="w-full max-w-md !bg-[#0F172A] !text-black rounded-xl p-8 shadow-[0_0_15px_rgba(0,0,0,0.2)] !border !border-gradient-to-r !from-[#ffffff1a] !via-[#ffffff1a] !to-transparent">
        <h1 className="text-4xl font-bold text-center mb-10 !text-white">
          Login
        </h1>

        <Form form={form} name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            label={<span className="!text-white text-base">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              className="!h-12 !bg-white"
              prefix={<UserOutlined className="!text-gray-400" />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label={<span className="!text-white text-base">Password</span>}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              className="!h-12 !bg-white"
              prefix={<LockOutlined className="!text-gray-400" />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="!w-full !relative !overflow-hidden !font-neue_montreal !tracking-wider !px-4 !py-5 !rounded-full !text-white !border !border-gray-200 hover:!text-black !bg-transparent group"
            style={{
              height: "auto",
              backgroundColor: "transparent !important"
            }}
          >
            <span className="!relative !z-10">
              {loading ? "Signing In..." : "Sign In"}
            </span>
            <span className="!absolute !overflow-hidden !inset-0 !bg-white transform !scale-y-0 !origin-top group-hover:!scale-y-100 !transition-transform !duration-300 !ease-out"></span>
          </Button>
        </Form>

        <div className="mt-8 text-center text-base !text-white/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="!text-white hover:!text-white/80 !font-medium"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
