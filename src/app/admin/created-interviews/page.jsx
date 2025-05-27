"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import axiosInstance from "../../../lib/axioshttp";
import { Button, Modal, Progress, Tabs, Empty, Badge } from "antd";
import {
  ExclamationCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  LineChartOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import Navbar from "@/components/Custom/Navbar";
import withauth from "@/components/Custom/withauth";
import "./styles.css"; // Assuming you have a styles.css for custom styles

const { TabPane } = Tabs;

const CreatedInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [timer, setTimer] = useState(5);
  const [performanceModalVisible, setPerformanceModalVisible] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const router = useRouter();

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      let token;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      if (!token) {
        router.push("/login");
        return;
      }

      const { data } = await axiosInstance.get("/GetAdminInterviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInterviews(data.data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
      toast.error("Failed to load interviews");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [router]);

  const showDeleteModal = (id) => {
    setSelectedInterviewId(id);
    setDeleteModalVisible(true);
    setConfirmDisabled(true);
    setTimer(5);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setConfirmDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      await axiosInstance.post(
        "/DeleteAdminInterview",
        { id: selectedInterviewId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeleteModalVisible(false);
      toast.success("Interview deleted successfully");
      fetchInterviews();
    } catch (error) {
      console.error("Error deleting interview:", error);
      toast.error("Failed to delete interview");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showPerformanceModal = (interview) => {
    setSelectedInterview(interview);
    setPerformanceModalVisible(true);
  };

  const getStatusBadge = (status) => {
    if (status === "completed") {
      return (
        <Badge status="success" text="Completed" className="!text-green-500" />
      );
    } else if (status === "pending") {
      return (
        <Badge status="warning" text="Pending" className="!text-yellow-500" />
      );
    } else {
      return (
        <Badge status="default" text={status} className="!text-gray-500" />
      );
    }
  };

  const renderPerformanceMetrics = (result) => {
    const metrics = [
      { name: "Technical", value: result.Technical || 0, color: "#4f46e5" },
      {
        name: "Communication",
        value: result.Communication || 0,
        color: "#06b6d4",
      },
      {
        name: "Problem Solving",
        value: result.ProblemSolving || 0,
        color: "#10b981",
      },
      { name: "Soft Skills", value: result.SoftSkills || 0, color: "#f59e0b" },
      { name: "Leadership", value: result.Leadership || 0, color: "#ef4444" },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="text-sm !text-slate-300">{metric.name}</span>
              <span className="text-sm !text-slate-300">{metric.value}%</span>
            </div>
            <Progress
              percent={metric.value}
              showInfo={false}
              strokeColor={metric.color}
              trailColor="#334155"
              size="small"
            />
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen !bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 !border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {" "}
      <Navbar background={"!bg-[#0F172A] !text-white"} />
      <div className="min-h-screen py-8 !bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 !text-white">
            Created Interviews
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interviews?.map((interview) => (
              <div
                key={interview?._id}
                className="!bg-slate-800 rounded-lg shadow-xl overflow-hidden !border !border-slate-700 hover:!border-blue-500 transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-semibold !text-white truncate">
                        {interview?.title}
                      </h2>
                      <Button
                        type="text"
                        danger
                        onClick={() => showDeleteModal(interview._id)}
                        className="flex items-center hover:!bg-red-500 hover:!text-white group"
                        icon={
                          <DeleteOutlined className="!text-red-500 group-hover:!text-white" />
                        }
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="flex items-center mb-2">
                      {getStatusBadge(interview.status)}
                      <span className="ml-3 !text-slate-400 text-sm">
                        {interview.type} •{" "}
                        {new Date(interview.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="!text-slate-400 text-sm mb-4 line-clamp-2">
                      {interview?.description || "No description provided"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {interview?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 !bg-slate-700 !text-slate-300 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="!text-slate-400 text-sm flex items-center">
                      <UserOutlined className="mr-1" />
                      {interview.results?.length || 0}{" "}
                      {interview.results?.length === 1 ? "attempt" : "attempts"}
                    </div>

                    <Button
                      type="primary"
                      onClick={() => showPerformanceModal(interview)}
                      className="!bg-indigo-600 hover:!bg-indigo-700 !text-white !border-none flex items-center"
                      icon={<LineChartOutlined />}
                    >
                      View Results
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {interviews.length === 0 && (
            <div className="text-center py-12">
              <Empty
                description={
                  <span className="!text-slate-300">
                    No interviews created yet
                  </span>
                }
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className="!text-slate-300"
              />
              <p className="!text-slate-400 mt-2">
                Start by creating your first interview
              </p>
            </div>
          )}

          {/* Delete Modal */}
          <Modal
            title={
              <div className="flex items-center gap-2">
                <ExclamationCircleOutlined className="!text-red-500 text-xl" />
                <span className="!text-white text-lg font-semibold">
                  Confirm Delete
                </span>
              </div>
            }
            open={deleteModalVisible}
            onCancel={() => setDeleteModalVisible(false)}
            footer={[
              <Button
                key="cancel"
                onClick={() => setDeleteModalVisible(false)}
                className="!bg-slate-700 !text-white hover:!bg-slate-600 !border-slate-600 min-w-[100px] !font-medium"
                icon={<CloseOutlined />}
              >
                Cancel
              </Button>,
              <Button
                key="delete"
                type="primary"
                danger
                disabled={confirmDisabled}
                loading={deleteLoading}
                onClick={handleDelete}
                className="!bg-red-500 !text-white hover:!bg-red-600 disabled:!bg-red-300 !border-red-600 min-w-[120px] !font-medium"
                icon={<DeleteOutlined />}
              >
                {confirmDisabled ? `Confirm (${timer}s)` : "Confirm Delete"}
              </Button>,
            ]}
            className="!bg-slate-800"
            styles={{
              content: {
                background: "#1e293b !important",
                padding: "28px",
                borderRadius: "12px",
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              },
              header: {
                background: "#1e293b !important",
                borderBottom: "1px solid #334155",
                padding: "16px 24px",
              },
              footer: {
                background: "#1e293b !important",
                borderTop: "1px solid #334155",
                padding: "16px 24px",
              },
              body: {
                padding: "28px 24px",
              },
              mask: {
                backgroundColor: "rgba(0, 0, 0, 0.7) !important",
              },
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="p-4 !bg-red-500/10 rounded-lg !border !border-red-500/20">
                <p className="!text-slate-200 !text-base leading-relaxed">
                  Are you sure you want to delete this interview? This action is
                  permanent and cannot be reversed. All associated data will be
                  permanently removed.
                </p>
              </div>
              <div className="text-sm !text-slate-400">
                Please wait {timer} seconds before confirming deletion.
              </div>
            </div>
          </Modal>

          {/* Performance Modal */}
          <Modal
            title={
              <div className="flex items-center justify-between !text-white">
                <span className="text-lg font-semibold">
                  {selectedInterview?.title} - Performance Results
                </span>
                {/* <div className="flex items-center">
                  {getStatusBadge(selectedInterview?.status)}
                </div> */}
              </div>
            }
            open={performanceModalVisible}
            onCancel={() => setPerformanceModalVisible(false)}
            footer={null}
            width={800}
            className="!bg-slate-800"
            // styles={{
            //   content: {
            //     background: "#1e293b !important",
            //     padding: "0",
            //     borderRadius: "12px",
            //     boxShadow:
            //       "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
            //   },
            //   header: {
            //     background: "#1e293b !important",
            //     borderBottom: "1px solid #334155",
            //     padding: "16px 24px",
            //   },
            //   body: {
            //     padding: "0",
            //   },
            //   mask: {
            //     backgroundColor: "rgba(0, 0, 0, 0.7) !important",
            //   },
            // }}
          >
            {selectedInterview?.results?.length > 0 ? (
              <Tabs
                defaultActiveKey="0"
                tabPosition="left"
                className="performance-tabs"
                styles={{
                  tabPane: {
                    padding: "20px",
                  },
                  nav: {
                    backgroundColor: "#0f172a",
                    borderRight: "1px solid #334155",
                  },
                }}
              >
                {selectedInterview?.results.map((result, index) => (
                  <TabPane
                    tab={
                      <div className="flex flex-col items-start py-2">
                        <span className="!text-slate-200 font-medium">
                          {result.user?.name}
                        </span>
                        <span className="!text-slate-400 text-xs">
                          {result.user?.email}
                        </span>
                      </div>
                    }
                    key={index.toString()}
                  >
                    <div className="p-4 !bg-slate-800 rounded-lg">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold !text-white mb-2">
                          User Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="!bg-slate-700 p-3 rounded-lg">
                            <p className="!text-slate-400 text-sm">Name</p>
                            <p className="!text-white">{result.user?.name}</p>
                          </div>
                          <div className="!bg-slate-700 p-3 rounded-lg">
                            <p className="!text-slate-400 text-sm">Email</p>
                            <p className="!text-white">{result.user?.email}</p>
                          </div>
                          <div className="!bg-slate-700 p-3 rounded-lg">
                            <p className="!text-slate-400 text-sm">Phone</p>
                            <p className="!text-white">
                              {result.user?.phone || "N/A"}
                            </p>
                          </div>
                          <div className="!bg-slate-700 p-3 rounded-lg">
                            <p className="!text-slate-400 text-sm">
                              Overall Result
                            </p>
                            <p
                              className={`font-semibold ${
                                result.Success === "Bad"
                                  ? "!text-red-500"
                                  : result.Success === "Good"
                                  ? "!text-green-500"
                                  : "!text-yellow-500"
                              }`}
                            >
                              {result.Success || "Not evaluated"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h3 className="text-lg font-semibold !text-white mb-2">
                          Performance Metrics
                        </h3>
                        {renderPerformanceMetrics(result)}
                      </div>

                      {(result.AI_Recommendation || result.AI_Suggestion) && (
                        <div className="mb-6">
                          <h3 className="text-lg font-semibold !text-white mb-2">
                            AI Feedback
                          </h3>

                          {result.AI_Recommendation && (
                            <div className="!bg-slate-700 p-4 rounded-lg mb-3">
                              <p className="!text-slate-300 font-medium mb-2">
                                Recommendation
                              </p>
                              <p className="!text-slate-400">
                                {result.AI_Recommendation}
                              </p>
                            </div>
                          )}

                          {result.AI_Suggestion && (
                            <div className="!bg-slate-700 p-4 rounded-lg">
                              <p className="!text-slate-300 font-medium mb-2">
                                Suggestions for Improvement
                              </p>
                              <p className="!text-slate-400">
                                {result.AI_Suggestion}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        {/* <Button
                          type="primary"
                          className="!bg-indigo-600 hover:!bg-indigo-700 !border-none"
                          icon={<EyeOutlined />}
                          onClick={() =>
                            router.push(
                              `/admin/interview-performance/${selectedInterview._id}/${result.user?._id}`
                            )
                          }
                        >
                          View Detailed Performance
                        </Button> */}
                      </div>
                    </div>
                  </TabPane>
                ))}
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <ClockCircleOutlined className="text-4xl !text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold !text-slate-200 mb-2">
                  No Results Yet
                </h3>
                <p className="!text-slate-400 text-center max-w-md">
                  This interview hasnt been attempted by any users yet. Results
                  will appear here once someone completes the interview.
                </p>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  );
};

export default withauth(CreatedInterviews);
