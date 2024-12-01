"use client";
import React, { useState } from "react";
import { Button, Card, Tabs } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Custom/Navbar";
import "./styles.css";
import withauth from "../../components/Custom/withauth";

function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("1");

  const myInterviews = [
    {
      id: 1,
      title: "System Design Interview",
      date: "2024-02-15",
      score: "85/100",
      length: "60 mins",
    },
    {
      id: 2,
      title: "Algorithm Challenge", 
      date: "2024-02-10",
      score: "92/100",
      length: "45 mins",
    },
    {
      id: 3,
      title: "Frontend Development",
      date: "2024-02-05", 
      score: "78/100",
      length: "90 mins",
    },
  ];

  const items = [
    {
      key: "1",
      label: (
        <span className="!text-xl hover:!text-blue-500 [&.ant-tabs-tab-active]:!text-blue-500">
          My Interview History
        </span>
      ),
      children: (
        <div className="space-y-6">
          {myInterviews.map((interview) => (
            <Card
              key={interview.id}
              title={<span className="text-slate-200">{interview.title}</span>}
              className="overflow-hidden bg-slate-800 border border-slate-700 hover:border-blue-500 transition-all duration-300"
              extra={
                <Button
                  type="primary"
                  className="bg-blue-500 hover:bg-blue-600"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    router.push(`/my-interviews/${interview.id}`);
                  }}
                >
                  View Details
                </Button>
              }
            >
              <div className="text-slate-300">
                <p>Date: {interview.date}</p>
                <p>Score: {interview.score}</p>
                <p>Duration: {interview.length}</p>
              </div>
            </Card>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar  background={'bg-[#0F172A] text-white'} />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="text-white"
        />
      </div>
    </div>
  );
}

export default withauth(Page);
