"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import withauth from "../../../components/Custom/withauth";
import axios from "axios";
import axiosPost from "../../../lib/axioshttp";
import { message } from "antd";
import { Plus } from "lucide-react";

const Generate = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    main_business: "",
    case_type: "",
    difficulty_level: "",
  });
  const fields = [
    {
      key: "main_business",
      label: "Main business or Industry",
      type: "dropdown",
      Children: [
        {
          key: "main_business",
          value: "technology & telecommunications",
          label: "Technology & Telecommunications",
        },
        {
          key: "main_business",
          value: "healthcare and life sciences",
          label: "Healthcare and Life Sciences",
        },
        {
          key: "main_business",
          value: "financial services",
          label: "Financial Services",
        },
        {
          key: "main_business",
          value: "consumer goods & retail",
          label: "Consumer Goods & Retail",
        },
        {
          key: "main_business",
          value: "manufacturing and industrial",
          label: "Manufacturing and Industrial",
        },
        {
          key: "main_business",
          value: "energy and utilities",
          label: "Energy and Utilities",
        },
        {
          key: "main_business",
          value: "professional services",
          label: "Professional Services",
        },
        {
          key: "main_business",
          value: "media and entertainment",
          label: "Media and Entertainment",
        },
        {
          key: "main_business",
          value: "transportation and logistics",
          label: "Transportation and Logistics",
        },
        {
          key: "main_business",
          value: "public sector and non-profit",
          label: "Public Sector and Non-profit",
        },
      ],
    },
    {
      key: "case_type",
      label: "Case type",
      type: "dropdown",
      Children: [
        {
          key: "case_type",
          value: "market entry",
          label: "Market Entry",
        },
        {
          key: "case_type",
          value: "m & a",
          label: "M & A",
        },
        {
          key: "case_type",
          value: "product launch",
          label: "Product Launch",
        },
        {
          key: "case_type",
          value: "competitive response",
          label: "Competitive Response",
        },
        {
          key: "case_type",
          value: "investment decision",
          label: "Investment Decision",
        },
        {
          key: "case_type",
          value: "operations improvement",
          label: "Operations Improvement",
        },
        {
          key: "case_type",
          value: "cost cutting",
          label: "Cost Cutting",
        },
      ],
    },

    {
      key: "difficulty_level",
      label: "Difficulty Level",
      type: "dropdown",
      Children: [
        {
          key: "difficulty_level",
          value: "beginner",
          label: "Beginner",
        },
        {
          key: "difficulty_level",
          value: "intermediate",
          label: "Intermediate",
        },
        {
          key: "difficulty_level",
          value: "advanced",
          label: "Advanced",
        },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const systemPrompt = `**Custom Instruction for Generating Detailed Case Prompts**
When given specific fields such as Case Type, Main Business, and Difficulty Level, create a structured case prompt with the following essential sections:
### **Interview Overview**
**Interview Title:** [Create a compelling title related to the Main Business]
**Difficulty Level:** [Insert Difficulty Level]
**Interview Prompt:**  
[Write a detailed scenario that sets the stage for the case study. Mention the company, its main business challenge, and competitive context if needed.]
**Industry:** [Specify the related industry]
**Interview Type:** [Insert Case Type]
### **Exhibits**
*Exhibit 1: [Provide a brief description, e.g., Market Analysis, Financials]*
| Metric | Value | Notes |
| --- | --- | --- |
| [Key metric] | [Value] | [Additional information] |

*Exhibit 2: [Example: Competitor Analysis]*
| Competitor | Market Share | Product/Service |
| --- | --- | --- |
| [Company Name] | [Percentage] | [Details] |`;

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: `Generate a case study with the following details:
                    Case Type: ${formData.case_type}
                    Main Business: ${formData.main_business}
                    Difficulty Level: ${formData.difficulty_level}`,
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer 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`,
          },
        }
      );
      console.log("response", response);
      const generatedCase = response?.data?.choices[0]?.message?.content;
      if (generatedCase) {
        const titleMatch = generatedCase.match(
          /### \*\*Interview Overview\*\*\s*\n\*\*Interview Title:\*\* ([^\n]+)/
        );
        const title = titleMatch ? titleMatch[1].trim() : generatedCase;

        const response = await axiosPost.post("/InterviewCreation", {
          title: title,
          scenario: generatedCase,
          feedback: "",
          createdAt: new Date(),
          updatedAt: new Date(),
          isInterviewed: false,
          interviewDate: null,
          duration: 0,
        });
        message.success("Interview Case generated successfully");
        router.push(`/Interviews/view/${response?.data?.interview_id}`)
      }
    } catch (error) {
      console.error("Error generating case:", error);
      message.error("Failed to generate case. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <h1 className="text-2xl font-bold text-center text-slate-200 mb-8">
            Generate New Interview Case
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label
                  htmlFor={field.key}
                  className="text-slate-300 font-medium"
                >
                  {field.label}
                </label>
                <select
                  id={field.key}
                  name={field.key}
                  value={formData[field.key]}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                  required
                >
                  <option value="">Select {field.label}</option>
                  {field.Children.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      className="bg-slate-700"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            <button
              type="submit"
              className="relative inline-flex items-center justify-center gap-2 w-full py-3 text-white overflow-hidden rounded-xl group"
            >
              <span className="absolute inset-0 w-full h-full transition-all duration-500 ease-in-out bg-gradient-to-l from-blue-600 via-purple-600 to-indigo-600 group-hover:bg-gradient-to-r"></span>
              <span className="absolute inset-0 w-full h-full transition-all duration-500 rounded-xl opacity-0 group-hover:opacity-50 blur-xl bg-gradient-to-l from-blue-400 via-purple-400 to-indigo-400"></span>
              <span className="absolute inset-0 w-full h-full rounded-xl">
                <span className="absolute inset-0 w-full h-full transition-all duration-500 rounded-xl border-2 border-white/30 group-hover:border-white/60"></span>
                <span className="absolute inset-[-2px] rounded-xl bg-gradient-to-l from-blue-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <span className="absolute inset-[1px] rounded-xl bg-slate-900 group-hover:bg-slate-800 transition-colors duration-500"></span>
              </span>
              <Plus className="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="relative font-semibold transition-all duration-300 group-hover:tracking-wider">
                {loading ? "Generating..." : "Generate Case"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withauth(Generate);
