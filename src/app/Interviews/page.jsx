"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Tabs } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Custom/Navbar";
import "./styles.css";
import Link from "next/link";
import withauth from "@/components/Custom/withauth";
import axios from "../../lib/axioshttp";

function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("1");
  const [Interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get("/GetInterviews");
        setInterviews(res?.data?.data);
      } catch (error) {
        console.error("Error fetching interviews:", error);
        message.error("Failed to fetch interviews. Please try again.");
      }
    };
    fetchInterviews();
  }, []);

  const mockCases = [
    {
      id: 1,
      title: "System Design Interview",
      scenario: "Design a scalable social media platform like Twittera",
      length: "60 mins",
    },
    {
      id: 2,
      title: "Algorithm Challenge",
      scenario: "Implement a distributed cache system",
      length: "45 mins",
    },
    {
      id: 3,
      title: "Frontend Development",
      scenario: "Build a real-time chat application",
      length: "90 mins",
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <span className="!text-xl  hover:!text-blue-500 [&.ant-tabs-tab-active]:!text-blue-500">
          Mock Interviews
        </span>
      ),
      children: (
        <div className="space-y-6">
          {Interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-slate-800 rounded-xl border border-slate-700">
              <div className="text-slate-300 text-center mb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  No Interviews Found
                </h3>
                <p className="text-slate-400">
                  You haven&apos;t created any interviews yet.
                </p>
              </div>
              <Link
                href="/Interviews/generate"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 border-2 border-transparent hover:border-blue-400 shadow-lg hover:shadow-blue-500/25"
              >
                Create Your First Interview
              </Link>
            </div>
          ) : (
            Interviews.map((m) => (
              <Card
                key={m._id}
                title={<span className="text-slate-200">{m?.title}</span>}
                className="overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300"
                extra={
                  <Button
                    type="primary"
                    className="bg-blue-500 hover:bg-blue-600"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      router.push(`/Interviews/view/${m._id}`);
                    }}
                  >
                    View Interview
                  </Button>
                }
              >
                <div className="text-slate-300">
                  <p className="line-clamp-2">
                    {m.scenario.length > 50
                      ? m.scenario.substring(0, 50) + "..."
                      : m.scenario}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <span className="!text-xl hover:!text-blue-500 [&.ant-tabs-tab-active]:!text-blue-500">
          AI Generated Interviews
        </span>
      ),
      children: (
        <div className="space-y-6">
          {Interviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 bg-slate-800 rounded-xl border border-slate-700">
              <div className="text-slate-300 text-center mb-6">
                <h3 className="text-2xl font-semibold mb-2">
                  No Interviews Found
                </h3>
                <p className="text-slate-400">
                  You haven&apos;t created any interviews yet.
                </p>
              </div>
              <Link
                href="/Interviews/generate"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 border-2 border-transparent hover:border-blue-400 shadow-lg hover:shadow-blue-500/25"
              >
                Create Your First Interview
              </Link>
            </div>
          ) : (
            Interviews.map((m) => (
              <Card
                key={m._id}
                title={<span className="text-slate-200">{m?.title}</span>}
                className="overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300"
                extra={
                  <Button
                    type="primary"
                    className="bg-blue-500 hover:bg-blue-600"
                    icon={<EyeOutlined />}
                    onClick={() => {
                      router.push(`/interviews/${m._id}`);
                    }}
                  >
                    View Interview
                  </Button>
                }
              >
                <div className="text-slate-300">
                  <p className="line-clamp-2">
                    {m.scenario.length > 50
                      ? m.scenario.substring(0, 50) + "..."
                      : m.scenario}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 ">
      <Navbar background={"bg-[#0F172A] text-white"} />
      <div className="max-w-full py-4 px-10">
        <div className="flex justify-between items-center relative group overflow-hidden rounded-xl p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-[2px] bg-slate-900 rounded-lg z-10"></div>
          <div className="relative z-20">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              Interview Cases
            </h1>
          </div>
          <Link
            href="/Interviews/generate"
            className="relative z-20 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 border-2 border-transparent hover:border-blue-400 shadow-lg hover:shadow-blue-500/25"
          >
            Generate New Case
          </Link>
        </div>
        <Tabs
          activeKey={activeTab}
          items={items}
          onChange={setActiveTab}
          className="text-white custom-tabs"
        />
      </div>
    </div>
  );
}

export default withauth(Page);
