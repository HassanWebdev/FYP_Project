"use client";
import React, { useEffect, useState } from "react";
import Markdown from "react-markdown";
import axios from "@/lib/axioshttp";
import Navbar from "@/components/Custom/Navbar";
import { Card } from "antd";
import remarkGfm from "remark-gfm";
import withauth from "../../../../components/Custom/withauth";
import { Play } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function InterviewView({ params }) {
  const pathname = usePathname();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await axios.post(`/GetInterviews/specificInterview`, {
          interviewId: params.id,
          role: params.role || "user",
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
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar background={"bg-[#0F172A] text-white"} />
      <div className="max-w-full py-4 px-10">
        <Card
          className="overflow-hidden !bg-slate-800 !border !border-slate-700"
          title={
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
              {interview?.title}
            </h1>
          }
        >
          <div className="prose prose-invert max-w-none text-white">
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold text-blue-400 border-b-2 border-blue-400 pb-2 mb-6">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold text-purple-400 mt-8 mb-4">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-cyan-400 mt-6 mb-3">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="my-4 leading-relaxed">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 my-4 ml-4">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-gray-300">{children}</li>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-8">
                    <table className="min-w-full border border-slate-600 rounded-lg">
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children }) => (
                  <th className="bg-slate-700 text-white px-6 py-3 text-left text-sm font-semibold border-b border-slate-600">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="px-6 py-4 text-sm border-b border-slate-600">
                    {children}
                  </td>
                ),
                strong: ({ children }) => (
                  <strong className="font-bold text-yellow-400">
                    {children}
                  </strong>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic bg-slate-700/50 p-4 rounded">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="my-8 border-slate-600" />,
              }}
            >
              {interview?.scenario || "No scenario available"}
            </Markdown>
          </div>
          <Link
            href={`${pathname}/MockMaster.AI`}
            className="flex justify-center mt-8"
          >
            <button className="relative inline-flex items-center gap-2 px-8 py-4 text-lg text-white overflow-hidden rounded-xl group">
              {/* Animated gradient background */}
              <span className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out bg-gradient-to-l from-blue-600 via-purple-600 to-indigo-600 group-hover:bg-gradient-to-r"></span>

              {/* Glowing effect */}
              <span className="absolute inset-0 w-full h-full transition-all duration-500 rounded-xl opacity-0 group-hover:opacity-50 blur-xl bg-gradient-to-l from-blue-400 via-purple-400 to-indigo-400"></span>

              {/* Animated border */}
              <span className="absolute inset-0 w-full h-full rounded-xl">
                <span className="absolute inset-0 w-full h-full transition-all duration-500 rounded-xl border-2 border-white/30 group-hover:border-white/60"></span>
                <span className="absolute inset-[-2px] rounded-xl bg-gradient-to-l from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="absolute inset-[1px] rounded-xl bg-slate-900 group-hover:bg-slate-800 transition-colors duration-500"></span>
              </span>

              {/* Content */}
              <Play className="relative w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative font-semibold transition-all duration-300 group-hover:tracking-wider">
                Start Interview
              </span>
            </button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default withauth(InterviewView);
