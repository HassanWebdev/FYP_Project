"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import axiosInstance from "../../../lib/axioshttp";
import { Button, Modal } from "antd";
import { ExclamationCircleOutlined, CloseOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Navbar from "@/components/Custom/Navbar";
import withauth from "@/components/Custom/withauth";

const CreatedInterviews = () => {
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedInterviewId, setSelectedInterviewId] = useState(null);
    const [confirmDisabled, setConfirmDisabled] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [timer, setTimer] = useState(5);
    const router = useRouter();

    const fetchInterviews = async () => {
        try {
            setLoading(true);
            let token;
            if (typeof window !== 'undefined') {
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

            await axiosInstance.post("/DeleteAdminInterview",
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

    if (loading) {
        return (
            <div className="min-h-screen !bg-slate-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 !border-blue-500"></div>
            </div>
        );
    }

    return (
        <> <Navbar background={'!bg-[#0F172A] !text-white'} />

            <div className="min-h-screen py-8 !bg-slate-900">

                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 !text-white">Created Interviews</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {interviews?.map((interview) => (
                            <div
                                key={interview?._id}
                                className="!bg-slate-800 rounded-lg shadow-xl overflow-hidden !border !border-slate-700 hover:!border-blue-500 transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col mb-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-xl font-semibold !text-white">
                                                {interview?.title}
                                            </h2>
                                            <Button
                                                type="text"
                                                danger
                                                onClick={() => showDeleteModal(interview._id)}
                                                className="flex items-center hover:!bg-red-500 hover:!text-white group"
                                                icon={<DeleteOutlined className="!text-red-500 group-hover:!text-white" />}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                        <p className="!text-slate-400 text-sm mb-4 line-clamp-2">
                                            {interview?.description}
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

                                    <Link
                                        href={`/Interviews/ViewCustom/${interview?._id}/admin`}
                                        className="relative inline-flex w-full group"
                                    >
                                        <div className="absolute -inset-0.5 !bg-gradient-to-r !from-blue-500 !via-indigo-500 !to-blue-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                                        <button className="relative w-full px-6 py-3 !bg-slate-800 rounded-lg leading-none flex items-center justify-center gap-2 !text-white">
                                            <EyeOutlined />
                                            <span>View Performance</span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {interviews.length === 0 && (
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-semibold !text-slate-300">
                                No interviews created yet
                            </h2>
                            <p className="!text-slate-400 mt-2">
                                Start by creating your first interview
                            </p>
                        </div>
                    )}

                    <Modal
                        title={
                            <div className="flex items-center gap-2">
                                <ExclamationCircleOutlined className="!text-red-500 text-xl" />
                                <span className="!text-white text-lg font-semibold">Confirm Delete</span>
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
                                {confirmDisabled ? `Confirm (${timer}s)` : 'Confirm Delete'}
                            </Button>
                        ]}
                        className="!bg-slate-800"
                        styles={{
                            content: {
                                background: '#1e293b !important',
                                padding: '28px',
                                borderRadius: '12px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                            },
                            header: {
                                background: '#1e293b !important',
                                borderBottom: '1px solid #334155',
                                padding: '16px 24px',
                            },
                            footer: {
                                background: '#1e293b !important',
                                borderTop: '1px solid #334155',
                                padding: '16px 24px',
                            },
                            body: {
                                padding: '28px 24px',
                            },
                            mask: {
                                backgroundColor: 'rgba(0, 0, 0, 0.7) !important'
                            }
                        }}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="p-4 !bg-red-500/10 rounded-lg !border !border-red-500/20">
                                <p className="!text-slate-200 !text-base leading-relaxed">
                                    Are you sure you want to delete this interview? This action is permanent and cannot be reversed. All associated data will be permanently removed.
                                </p>
                            </div>
                            <div className="text-sm !text-slate-400">
                                Please wait {timer} seconds before confirming deletion.
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </>
    );
};

export default withauth(CreatedInterviews);
