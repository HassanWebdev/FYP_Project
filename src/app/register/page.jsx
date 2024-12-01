"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "../../lib/axioshttp";
import { useRouter } from "next/navigation";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/Auth/register", {
        name: values.fullName,
        email: values.email,
        password: values.password,
      });
      console.log(response)

      if (response.data) {
        message.success("Registration successful!");
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        router.push("/login");
      }
    } catch (error) {
      console.log(error)
      message.error(error.response?.data?.error || "Registration failed!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] p-4">
      <div className="w-full max-w-md bg-[#0F172A] !text-black rounded-xl p-8 shadow-[0_0_15px_rgba(0,0,0,0.2)] border border-gradient-to-r from-[#ffffff1a] via-[#ffffff1a] to-transparent">
        <h1 className="text-4xl font-bold text-center mb-10 text-white">
          Sign Up
        </h1>

        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            label={<span className="text-white text-base">Full Name</span>}
            name="fullName"
            rules={[
              { required: true, message: "Please input your full name!" },
            ]}
          >
            <Input
              className="!h-12"
              prefix={<UserOutlined />}
              placeholder="Enter your full name"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-white text-base">Email</span>}
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              className="!h-12"
              prefix={<MailOutlined />}
              placeholder="Enter your email"
            />
          </Form.Item>

          <Form.Item
            label={<span className="text-white text-base">Password</span>}
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Password must be at least 6 characters!" },
            ]}
          >
            <Input.Password
              className="!h-12"
              prefix={<LockOutlined />}
              placeholder="Enter your password"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-white text-base">Confirm Password</span>
            }
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              className="!h-12"
              prefix={<LockOutlined />}
              placeholder="Confirm your password"
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="!w-full !relative !overflow-hidden !font-neue_montreal !tracking-wider !px-4 !py-5 !rounded-full !text-white !border !border-gray-200 hover:!text-black !bg-transparent group"
            style={{
              height: "auto",
            }}
          >
            <span className="!relative !z-10">
              {loading ? "Creating Account..." : "Create Account"}
            </span>
            <span className="!absolute !overflow-hidden !inset-0 !bg-white transform !scale-y-0 !origin-top group-hover:!scale-y-100 !transition-transform !duration-300 !ease-out"></span>
          </Button>
        </Form>

        <div className="mt-8 text-center text-base text-white/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-white hover:text-white/80 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
