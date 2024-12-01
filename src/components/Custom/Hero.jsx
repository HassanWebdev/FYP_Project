"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import withauth from "./withauth";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function Hero() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const welcomeRef = useRef(null);
  const timeRef = useRef(null);
  const metricsRef = useRef(null);
  const chartsRef = useRef(null);

  useEffect(() => {
    if(typeof window !== "undefined"){
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const decoded = JSON.parse(user);
        setUserName(decoded.name || "User");
      } catch (error) {
        console.error("Error decoding token:", error);
        setUserName("User");
        }
      }
    }
  }, []);

  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('user')
    router.push('/login');
  };

  useGSAP(() => {
    // Mouse follower animation
    window.addEventListener("mousemove", (e) => {
      gsap.to("#mouse", {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "none",
      });
    });

    // Welcome section animation
    gsap.from(welcomeRef.current, {
      x: -100,
      opacity: 0,
      duration: 1,
      delay: 0.2
    });

    // Time section animation
    gsap.from(timeRef.current, {
      x: 100,
      opacity: 0,
      duration: 1,
      delay: 0.4
    });

    // Metrics animation
    gsap.from(metricsRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      delay: 0.6
    });

    // Charts staggered animation
    gsap.from(chartsRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      delay: 0.8
    });

  });

  const interviewChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "linear",
        speed: 800,
      },
      background: "#1e293b",
    },
    colors: ["#60a5fa"],
    plotOptions: {
      bar: {
        borderRadius: 8,
        columnWidth: "60%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    grid: {
      borderColor: "#334155",
    },
    theme: {
      mode: "dark",
    },
  };

  const interviewSeries = [
    {
      name: "Interviews",
      data: [12, 19, 15, 25, 22, 14, 18],
    },
  ];

  const performanceChartOptions = {
    chart: {
      type: "polarArea",
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 800,
      },
      background: "#1e293b",
    },
    colors: ["#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6"],
    labels: [
      "Technical",
      "Communication", 
      "Problem Solving",
      "Soft Skills",
      "Leadership",
    ],
    stroke: {
      colors: ["#1e293b"],
    },
    fill: {
      opacity: 0.8,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    theme: {
      mode: "dark",
    },
  };

  const performanceSeries = [85, 75, 90, 82, 78];

  const donutChartOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        speed: 800,
      },
      background: "#1e293b",
    },
    colors: ["#22d3ee", "#a855f7", "#fbbf24", "#f43f5e"],
    labels: ["Excellent", "Good", "Average", "Needs Improvement"],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 270,
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: {
              fontSize: "22px",
              fontFamily: "NeueMontreal-Bold",
            },
            value: {
              fontSize: "16px",
              fontFamily: "NeueMontreal",
            },
            total: {
              show: true,
              label: "Total Reviews",
              formatter: function (w) {
                return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
    },
    theme: {
      mode: "dark",
    },
  };

  const donutSeries = [45, 30, 15, 10];

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div
        id="mouse"
        className={`w-5 h-5 bg-blue-500 fixed top-0 left-0 z-[99] rounded-full pointer-events-none blur-sm`}
      ></div>

      <div className="max-w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div ref={welcomeRef} className="space-y-2 relative group overflow-hidden rounded-xl p-5">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-[2px] bg-slate-900 rounded-lg z-10"></div>
            <div className="relative z-20 transform group-hover:-translate-y-1 transition-transform duration-300">
              <h2 className="text-2xl text-slate-400 group-hover:text-white transition-colors duration-300">Welcome back,</h2>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text transform group-hover:scale-105 transition-transform duration-300">
                {userName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div ref={timeRef} className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-[2px] bg-slate-800 rounded-2xl z-10"></div>
              <div className="relative z-20 transform group-hover:-translate-y-1 transition-transform duration-300">
                <p className="text-sm text-slate-400 group-hover:text-white transition-colors duration-300">Current Time</p>
                <p className="text-2xl font-bold text-white">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-slate-800/50 p-4 rounded-2xl backdrop-blur-sm border border-slate-700 relative group overflow-hidden hover:bg-red-500/10 transition-colors duration-300"
            >
              <LogOut className="w-6 h-6 text-white group-hover:text-red-500 transition-colors duration-300" />
            </button>
          </div>
        </div>
        <Card ref={metricsRef} className="col-span-full md:col-span-2 bg-slate-800 border-slate-700 mb-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-[2px] bg-slate-800 rounded-lg z-10"></div>
          <div className="relative z-20">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Interviews",
                    value: "125",
                    change: "↑ 12% increase",
                    changeColor: "text-emerald-400"
                  },
                  {
                    title: "Success Rate",
                    value: "84%",
                    change: "↑ 8% increase",
                    changeColor: "text-emerald-400"
                  },
                  {
                    title: "Average Rating",
                    value: "4.2/5",
                    change: "↑ 0.3 points",
                    changeColor: "text-emerald-400"
                  },
                  {
                    title: "Response Time",
                    value: "24min",
                    change: "↓ 2min slower",
                    changeColor: "text-rose-400"
                  }
                ].map((metric, index) => (
                  <div key={index} className="bg-slate-700/50 p-6 rounded-xl relative group/metric overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-[2px] bg-slate-700/50 rounded-xl z-10"></div>
                    <div className="relative z-20 transform group-hover/metric:-translate-y-1 transition-transform duration-300">
                      <p className="text-sm text-slate-400 group-hover/metric:text-white transition-colors duration-300">{metric.title}</p>
                      <p className="text-3xl font-bold text-white mt-2">{metric.value}</p>
                      <p className={`${metric.changeColor} text-sm mt-2`}>{metric.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>
        <div ref={chartsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Interview Analytics",
              span: "lg:col-span-2",
              chart: (
                <Chart
                  options={interviewChartOptions}
                  series={interviewSeries}
                  type="bar"
                  height="100%"
                />
              )
            },
            {
              title: "Success Distribution",
              span: "lg:col-span-1",
              chart: (
                <Chart
                  options={donutChartOptions}
                  series={donutSeries}
                  type="donut"
                  height="100%"
                />
              )
            },
            {
              title: "Skill Analysis",
              span: "col-span-full",
              chart: (
                <Chart
                  options={performanceChartOptions}
                  series={performanceSeries}
                  type="polarArea"
                  height="100%"
                />
              )
            }
          ].map((item, index) => (
            <Card key={index} className={`${item.span} bg-slate-800 border-slate-700 relative group overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-[2px] bg-slate-800 rounded-lg z-10"></div>
              <div className="relative z-20">
                <CardHeader>
                  <CardTitle className="text-white transform group-hover:-translate-y-1 transition-transform duration-300">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {item.chart}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default withauth(Hero);
