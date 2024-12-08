"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axioshttp";
import Navbar from "@/components/Custom/Navbar";
import { Card } from "antd";
import withauth from "../../../../../components/Custom/withauth";

function InterviewView({ params }) {
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);
    console.log(params);

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const res = await axios.post(`/GetInterviews/specificInterview`, {
                    interviewId: params.id,
                    role: params.role,
                });
                console.log(res);
                setInterview(res?.data?.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching interview:", error);
                setLoading(false);
            }
        };
        fetchInterview();
    }, [params.id, params.role]);

    if (loading) {
        return (
            <div className="min-h-screen !bg-slate-900 flex justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 !border-blue-500"></div>
            </div>
        );
    }

    const renderTable = () => {
        if (!interview?.exhibit || interview.exhibit.length === 0) return null;

        const columns = [...new Set(interview.exhibit.flatMap(obj => Object.keys(obj)))];

        return (
            <div className="mt-8">
                <h2 className="text-2xl font-bold !text-white mb-4">{interview?.exhibit_title}</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full !bg-slate-700 !text-white !border !border-slate-600">
                        <thead>
                            <tr>
                                {columns.map((column, index) => (
                                    <th key={index} className="px-6 py-3 !border-b !border-slate-600 text-left">
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {interview.exhibit.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:!bg-slate-600">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="px-6 py-4 !border-b !border-slate-600">
                                            {row[column] || ''}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen !bg-slate-900">
            <Navbar background={"!bg-[#0F172A] !text-white"} />
            <div className="max-w-full py-4 px-10">
                <Card
                    className="!overflow-hidden !bg-slate-800 !border !border-slate-700"
                    title={
                        <h1 className="text-3xl font-bold !bg-gradient-to-r !from-blue-500 !to-purple-500 !text-transparent !bg-clip-text">
                            {interview?.title}
                        </h1>
                    }
                >
                    <div
                        className="prose prose-invert max-w-none !text-white"
                        dangerouslySetInnerHTML={{ __html: interview?.scenario }}
                    />
                    {renderTable()}
                </Card>
            </div>
        </div>
    );
}

export default withauth(InterviewView);
