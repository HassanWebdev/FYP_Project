"use client";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import axios from "@/lib/axioshttp";
import Navbar from "@/components/Custom/Navbar";
import { Card } from "antd";
import remarkGfm from "remark-gfm";
import withauth from "../../../../components/Custom/withauth";

function InterviewView({ params }) {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.post(`/GetInterviews/specificInterview`, {
          interviewId: params.id,
          role: params.role || 'user',
        });
        setInterview(res?.data?.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching interview:", error);
        setLoading(false);
      }
    };
    fetchInterview();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen !bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 !border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen !bg-slate-900">
      <Navbar background={"!bg-[#0F172A] !text-white"} />
      <div className="max-w-full py-4 px-10">
        <Card
          className="overflow-hidden !bg-slate-800 !border !border-slate-700"
          title={
            <h1 className="text-3xl font-bold !bg-gradient-to-r !from-blue-500 !to-purple-500 !text-transparent !bg-clip-text">
              {interview?.title}
            </h1>
          }
        >
          <div className="prose prose-invert max-w-none !text-white">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <table
                    style={{
                      marginBottom: "20px !important",
                      border: "1px solid black !important",
                      borderRadius: "5px !important",
                      margin: "auto !important",
                    }}
                  >
                    {children}
                  </table>
                ),
                th: ({ children }) => (
                  <th
                    style={{
                      border: "1px solid #000 !important",
                      paddingTop: "7px !important",
                      paddingBottom: "7px !important",
                      paddingRight: "10px !important",
                      paddingLeft: "10px !important",
                      backgroundColor: "#4D5E80 !important",
                      color: "white !important",
                      textAlign: "center !important",
                    }}
                  >
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    style={{
                      border: "1px solid #000 !important",
                      paddingTop: "5px !important",
                      paddingBottom: "5px !important",
                      paddingRight: "7px !important",
                      paddingLeft: "7px !important",
                    }}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {interview?.scenario || "No scenario available"}
            </Markdown>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default withauth(InterviewView);
