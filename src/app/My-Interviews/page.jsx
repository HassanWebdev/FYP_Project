"use client";
import React, { useEffect, useState } from "react";
import { Button, Card, Tabs, Modal, Spin, Empty, Badge, Progress } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Custom/Navbar";
import "./styles.css";
import withauth from "../../components/Custom/withauth";
import axios from "@/lib/axioshttp";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("1");
  const [loader, setLoader] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [currentResult, setcurrentResult] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getUserInterviews = async () => {
      try {
        setLoader(true);
        const response = await axios.get("/getUserInterviews");
        if (response.data.success) {
          setInterviews(response?.data?.data || []);
        }
        console.log("User Interviews:", response);
      } catch (error) {
        toast.error("Error fetching user interviews:", error);
      } finally {
        setLoader(false);
      }
    };
    getUserInterviews();
  }, []);

  const handleModal = (id) => {
    const result = interviews?.find((interview) => interview?._id === id);
    if (result) {
      setcurrentResult(result);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderResultDetails = () => {
    const result = currentResult?.result || {};

    return (
      <div className="space-y-6 text-white">
        <h2 className="text-2xl font-bold text-white mb-4">
          {currentResult?.title}
        </h2>

        <Card className="!bg-slate-700 !border-slate-600 mb-6">
          <h3 className="text-xl text-white mb-4">Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="mb-1 text-white">Technical Skills</p>
              <Progress
                percent={result?.Technical || 0}
                status="active"
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.2)"
              />
            </div>
            <div>
              <p className="mb-1 text-white">Communication</p>
              <Progress
                percent={result?.Communication || 0}
                status="active"
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.2)"
                className=""
              />
            </div>
            <div>
              <p className="mb-1 text-white">Problem Solving</p>
              <Progress
                percent={result?.ProblemSolving || 0}
                status="active"
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.2)"
              />
            </div>
            <div>
              <p className="mb-1 text-white">Soft Skills</p>
              <Progress
                percent={result?.SoftSkills || 0}
                status="active"
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.2)"
              />
            </div>
            <div>
              <p className="mb-1 text-white">Leadership</p>
              <Progress
                percent={result?.Leadership || 0}
                status="active"
                strokeColor="#ffffff"
                trailColor="rgba(255,255,255,0.2)"
              />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4">
          <Card className="!bg-slate-700 !border-slate-600">
            <h3 className="text-xl text-white mb-3">AI Recommendation</h3>
            <div className="p-3 bg-slate-800 rounded-md border border-slate-600 min-h-[80px] text-white">
              {result?.AI_Recommendation ? (
                <p>{result.AI_Recommendation}</p>
              ) : (
                <p className="text-slate-300 italic">
                  No recommendations provided
                </p>
              )}
            </div>
          </Card>

          <Card className="!bg-slate-700 !border-slate-600">
            <h3 className="text-xl text-white mb-3">AI Suggestion</h3>
            <div className="p-3 bg-slate-800 rounded-md border border-slate-600 min-h-[80px] text-white">
              {result?.AI_Suggestion ? (
                <p>{result.AI_Suggestion}</p>
              ) : (
                <p className="text-slate-300 italic">No suggestions provided</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const items = [
    {
      key: "1",
      label: (
        <span
          className="!text-xl hover:!text-blue-500 [&.ant-tabs-tab-active]:!text-blue-500"
          style={{ fontSize: "1.25rem !important" }}
        >
          My Interview History
        </span>
      ),
      children: (
        <div className="space-y-6">
          {loader ? (
            <div className="flex justify-center p-10">
              <Spin size="large" tip="Loading interviews..." />
            </div>
          ) : interviews?.length > 0 ? (
            interviews.map((interview) => (
              <Card
                key={interview?._id}
                title={
                  <span
                    className="!text-slate-200"
                    style={{ color: "rgb(226 232 240) !important" }}
                  >
                    {interview?.title}
                  </span>
                }
                className="overflow-hidden !bg-slate-800 !border !border-slate-700 hover:!border-blue-500 transition-all duration-300"
                style={{ backgroundColor: "rgb(30 41 59) !important" }}
                extra={
                  <Button
                    type="primary"
                    className="!bg-blue-500 hover:!bg-blue-600"
                    style={{ backgroundColor: "rgb(59 130 246) !important" }}
                    icon={<EyeOutlined />}
                    onClick={() => handleModal(interview?._id)}
                  >
                    View Details
                  </Button>
                }
              >
                <div
                  className="!text-slate-300"
                  style={{ color: "rgb(203 213 225) !important" }}
                >
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    <Badge
                      status={
                        interview?.status === "completed"
                          ? "success"
                          : "processing"
                      }
                      text={interview?.status}
                    />
                  </p>
                  <p>
                    <span className="font-semibold">Created:</span>{" "}
                    {formatDate(interview?.createdAt)}
                  </p>
                  <p>
                    <span className="font-semibold">Overall Result:</span>{" "}
                    {interview?.result?.Success || "N/A"}
                  </p>
                </div>
              </Card>
            ))
          ) : (
            <Empty description="No interviews found" className="!text-slate-400" />
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      className="min-h-screen !bg-slate-900"
      style={{ backgroundColor: "rgb(15 23 42) !important" }}
    >
      <Navbar
        background={"!bg-[#0F172A] !text-white"}
        style={{
          backgroundColor: "#0F172A !important",
          color: "white !important",
        }}
      />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={items}
          className="!text-white"
          style={{ color: "white !important" }}
        />

        <Modal
          open={isModalOpen}
          onCancel={closeModal}
          footer={[
            <Button
              key="close"
              onClick={closeModal}
              type="primary"
              className="!bg-blue-500"
            >
              Close
            </Button>,
          ]}
          width={800}
          className="interview-details-modal"
          styles={{
            mask: {
              backgroundColor: "rgba(0, 0, 0, 0.65)",
            },
            content: {
              backgroundColor: "#1e293b",
              borderRadius: "8px",
            },
          }}
        >
          {renderResultDetails()}
        </Modal>
      </div>
    </div>
  );
}

export default withauth(Page);
