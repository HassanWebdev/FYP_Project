"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import withauth from "../../../components/Custom/withauth";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate all fields are filled
    const isValid = Object.values(formData).every((value) => value !== "");

    if (!isValid) {
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      alert("Case created successfully!");
      router.push("/interviews");
      setLoading(false);
    }, 1500);
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
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {loading ? "Generating..." : "Generate Case"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withauth(Generate);
