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
        <span className="!text-xl hover:!text-blue-500 [&.ant-tabs-tab-active]:!text-blue-500" style={{fontSize: '1.25rem !important'}}>
          My Interview History
        </span>
      ),
      children: (
        <div className="space-y-6">
          {myInterviews.map((interview) => (
            <Card
              key={interview.id}
              title={<span className="!text-slate-200" style={{color: 'rgb(226 232 240) !important'}}>{interview.title}</span>}
              className="overflow-hidden !bg-slate-800 !border !border-slate-700 hover:!border-blue-500 transition-all duration-300"
              style={{backgroundColor: 'rgb(30 41 59) !important'}}
              extra={
                <Button
                  type="primary"
                  className="!bg-blue-500 hover:!bg-blue-600"
                  style={{backgroundColor: 'rgb(59 130 246) !important'}}
                  icon={<EyeOutlined />}
                  onClick={() => {
                    router.push(`/my-interviews/${interview.id}`);
                  }}
                >
                  View Details
                </Button>
              }
            >
              <div className="!text-slate-300" style={{color: 'rgb(203 213 225) !important'}}>
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
    <div className="min-h-screen !bg-slate-900" style={{backgroundColor: 'rgb(15 23 42) !important'}}>
      <Navbar background={'!bg-[#0F172A] !text-white'} style={{backgroundColor: '#0F172A !important', color: 'white !important'}} />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="!text-white"
          style={{color: 'white !important'}}
        />
      </div>
    </div>
  );
}

export default withauth(Page);
