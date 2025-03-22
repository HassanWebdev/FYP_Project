"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import withauth from "../../../components/Custom/withauth";
import axios from "axios";
import axiosPost from "../../../lib/axioshttp";
import { message } from "antd";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const Generate = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    main_business: "",
    case_type: "",
    difficulty_level: "",
  });

  
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  
  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  
  const floatVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  
  const formItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };

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

    const systemPrompt = `Generate a comprehensive business case interview scenario following this structure:

🎯 CASE OVERVIEW
================
Title: [Generate an engaging title reflecting the core business challenge]
Complexity: [Difficulty Level] 
Duration: 45 minutes
Industry Focus: [Main Business sector]
Case Category: [Case Type]

📝 BUSINESS CONTEXT
==================
[Provide a detailed 3-4 paragraph scenario including:
- Company background & market position
- Current business challenge
- Key stakeholders
- Competitive landscape
- Specific objectives or targets]

📊 KEY DATA POINTS
=================
Market Overview:
---------------
• Total Addressable Market: [Generate a realistic market size]
• Market Growth Rate: [Generate a realistic growth rate]
• Market Share Distribution: [Generate market shares for key players]

Financial Metrics:
----------------
• Revenue: [Generate realistic revenue figures]
• Operating Margin: [Generate realistic margin]
• Cost Structure: [Generate realistic cost breakdown]

📈 EXHIBITS
===========
Exhibit 1: Market Performance
----------------------------
[Generate 2-3 exhibits with realistic data. For each exhibit:
- Use actual company names (e.g. Samsung, Apple, Nike etc.)
- Include real-looking but randomized data
- Ensure data points are consistent with each other
- Add relevant metrics for the industry

Exhibit 2: Competitive Analysis
----------------------------
Example exhibits could include:
- Market share analysis
- Financial performance trends
- Customer segmentation
- Cost breakdown
- Regional distribution
- Product portfolio performance
- Operational metrics

Format exhibits as markdown tables with clear headers and properly aligned columns.
Make sure numbers follow logical patterns and show realistic year-over-year changes.]

🎯 CANDIDATE OBJECTIVES
=====================
1. Analyze the current situation
2. Identify key challenges
3. Develop strategic recommendations
4. Provide implementation timeline

Note: Generate fresh, randomized data for each case while maintaining realism and consistency within the industry context.`;

    try {
      const response = await axios.post(
        `https://api.openai.com/v1/chat/completion`,
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
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
        }
      );

      console.log("response", response);
      const generatedCase = response?.data?.choices[0]?.message?.content;

      if (generatedCase) {
        const titleMatch = generatedCase.match(/Title: ([^\n]+)/);
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
        router.push(`/Interviews/view/${response?.data?.interview_id}`);
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
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center text-slate-200 mb-8"
          >
            Generate New Interview Case
          </motion.h1>

          {loading && (
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="bg-slate-800/90 p-12 rounded-2xl flex flex-col items-center"
                variants={pulseVariants}
                animate="animate"
              >
                <motion.div
                  className="w-24 h-24 border-4 border-blue-500 border-t-transparent rounded-full mb-6"
                  variants={spinnerVariants}
                  animate="animate"
                />

                <motion.div
                  variants={floatVariants}
                  animate="animate"
                  className="flex flex-col items-center"
                >
                  <div className="text-white text-xl font-medium mb-2">
                    Crafting Your Case Study
                  </div>
                  <div className="text-slate-400 text-sm">
                    Building a comprehensive scenario...
                  </div>
                </motion.div>

                <motion.div className="mt-8 flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-3 h-3 bg-blue-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {fields.map((field, index) => (
              <motion.div
                custom={index}
                variants={formItemVariants}
                initial="hidden"
                animate="visible"
                key={field.key}
                className="flex flex-col gap-2"
              >
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
                  className="w-full !p-2.5 rounded-lg bg-slate-700 text-white border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
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
              </motion.div>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default withauth(Generate);
