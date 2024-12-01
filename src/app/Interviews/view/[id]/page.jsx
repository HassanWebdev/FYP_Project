"use client";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import axios from "@/lib/axioshttp";
import Navbar from "@/components/Custom/Navbar";
import { Card, Spin } from "antd";
import remarkGfm from "remark-gfm";

function InterviewView({ params }) {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.post(`/GetInterviews/specificInterview`, {
          interviewId: params.id,
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
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar background={"bg-[#0F172A] text-white"} />
      <div className="max-w-full py-4 px-10">
        <Card
          className="overflow-hidden bg-slate-800 border border-slate-700"
          title={
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              {interview?.title}
            </h1>
          }
        >
          <div className="prose prose-invert  max-w-none text-white">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <table
                    style={{
                      marginBottom: "20px",
                      border: "1px solid black",
                      borderRadius: "5px",
                      margin: "auto",
                    }}
                  >
                    {children}
                  </table>
                ),
                th: ({ children }) => (
                  <th
                    style={{
                      border: "1px solid #000",
                      paddingTop: "7px",
                      paddingBottom: "7px",
                      paddingRight: "10px",
                      paddingLeft: "10px",
                      backgroundColor: "#4D5E80",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    style={{
                      border: "1px solid #000",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      paddingRight: "7px",
                      paddingLeft: "7px",
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

export default InterviewView;
