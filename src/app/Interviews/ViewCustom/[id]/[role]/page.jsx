"use client";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axioshttp";
import Navbar from "@/components/Custom/Navbar";
import { Card } from "antd";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import withauth from "../../../../../components/Custom/withauth";
import Link from "next/link";
import { Play } from "lucide-react";

function InterviewView({ params }) {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log(params);
  const pathname = usePathname();
  console.log(pathname);

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
  }, [params.id, params.role, params]);

  if (loading) {
    return (
      <div className="min-h-screen !bg-slate-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 !border-blue-500"></div>
      </div>
    );
  }

  const renderTable = () => {
    if (!interview?.exhibit || interview.exhibit.length === 0) return null;

    const columns = [
      ...new Set(interview.exhibit.flatMap((obj) => Object.keys(obj))),
    ];

    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold !text-white mb-4">
          {interview?.exhibit_title}
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full !bg-slate-700 !text-white !border !border-slate-600">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 !border-b !border-slate-600 text-left"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {interview.exhibit.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:!bg-slate-600">
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 !border-b !border-slate-600"
                    >
                      {row[column] || ""}
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
