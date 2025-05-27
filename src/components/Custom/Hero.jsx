"use client";
import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import dynamic from "next/dynamic";
import { LogOut, Plus, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import withauth from "./withauth";
import axiosInstance from "@/lib/axioshttp";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function Hero() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const welcomeRef = useRef(null);
  const timeRef = useRef(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user) {
        try {
          const decoded = JSON.parse(user);
          setUserName(decoded.name || "User");
          setUserRole(decoded.role || "user");
        } catch (error) {
          console.error("Error decoding token:", error);
          setUserName("User");
          setUserRole("user");
        }
      }
    }
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        let endpoint = "/GetUserDashboard";

        if (userRole === "admin") {
          endpoint = "/GetAdminDashboard";
        }

        const response = await axiosInstance.get(endpoint);
        console.log("Dashboard data:", response.data.data);
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userRole) {
      fetchDashboardData();
    }
  }, [userRole]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleCreateInterview = () => {
    if (userRole === "admin") {
      router.push("/create-interview");
    } else {
      router.push("/Interviews/generate");
    }
  };

  useGSAP(() => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.pointerEvents = "none";
    container.style.zIndex = "9999";
    document.body.appendChild(container);

    const existingMouse = document.getElementById("mouse");
    if (existingMouse) {
      existingMouse.remove();
    }

    const cursor = document.createElement("div");
    cursor.id = "mouse";
    cursor.style.width = "16px";
    cursor.style.height = "16px";
    cursor.style.borderRadius = "50%";
    cursor.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    cursor.style.position = "fixed";
    cursor.style.transform = "translate(-50%, -50%)";
    cursor.style.mixBlendMode = "difference";
    cursor.style.boxShadow = "0 0 15px rgba(255, 255, 255, 0.5)";
    cursor.style.zIndex = "99";
    cursor.style.pointerEvents = "none";
    container.appendChild(cursor);

    const trailCount = 4;
    const trails = [];

    for (let i = 0; i < trailCount; i++) {
      const trail = document.createElement("div");
      trail.className = "mouse-trail";
      trail.style.width = `${12 - i * 2}px`;
      trail.style.height = `${12 - i * 2}px`;
      trail.style.borderRadius = "50%";
      trail.style.backgroundColor = `rgba(255, 255, 255, ${0.7 - i * 0.15})`;
      trail.style.position = "fixed";
      trail.style.transform = "translate(-50%, -50%)";
      trail.style.mixBlendMode = "difference";
      trail.style.zIndex = "98";
      trail.style.pointerEvents = "none";
      container.appendChild(trail);
      trails.push(trail);
    }

    let mouseX = 0;
    let mouseY = 0;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const velocityX = Math.abs(mouseX - prevMouseX);
      const velocityY = Math.abs(mouseY - prevMouseY);
      const velocity = Math.min(
        Math.sqrt(velocityX * velocityX + velocityY * velocityY) * 0.05,
        1
      );

      gsap.to(cursor, {
        width: 16 + velocity * 20,
        height: 16 + velocity * 20,
        duration: 0.3,
      });

      prevMouseX = mouseX;
      prevMouseY = mouseY;
    };

    const render = () => {
      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        duration: 0.3,
        ease: "power2.out",
      });

      trails.forEach((trail, index) => {
        gsap.to(trail, {
          x: mouseX,
          y: mouseY,
          duration: 0.5 + index * 0.1,
          ease: "power3.out",
          delay: index * 0.04,
        });
      });

      requestAnimationFrame(render);
    };

    window.addEventListener("mousemove", handleMouseMove);
    render();

    const addHoverEffects = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, select, textarea, [role="button"]'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(cursor, {
            width: 40,
            height: 40,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            duration: 0.3,
          });
        });

        el.addEventListener("mouseleave", () => {
          gsap.to(cursor, {
            width: 16,
            height: 16,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            duration: 0.3,
          });
        });
      });
    };

    addHoverEffects();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (container && document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  // Configure charts based on real data
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

  // We'll keep this data static as the API doesn't provide daily statistics
  const interviewSeries = [
    {
      name: "Interviews",
      data: [12, 19, 15, 25, 22, 14, 18],
    },
  ];

  // Configure skills chart based on real data
  const skillAverages = dashboardData?.skillAverages || {
    Technical: 0,
    Communication: 0,
    ProblemSolving: 0,
    SoftSkills: 0,
    Leadership: 0,
  };

  const performanceChartOptions = {
    chart: {
      type: "polarArea",
      toolbar: { show: false },
      animations: {
        enabled: false,
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

  const performanceSeries = [
    skillAverages.Technical,
    skillAverages.Communication,
    skillAverages.ProblemSolving,
    skillAverages.SoftSkills,
    skillAverages.Leadership,
  ];

  // Configure donut chart based on real data
  const donutChartOptions = {
    chart: {
      type: "donut",
      animations: {
        enabled: false,
      },
      background: "#1e293b",
    },
    colors: ["#22d3ee", "#a855f7", "#fbbf24", "#f43f5e", "#ef4444"],
    labels: ["Excellent", "Good", "Satisfactory", "Average", "Bad"],
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

  const donutSeries = dashboardData?.ratingStats?.donutChartData ;

  // Loading indicator component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center w-full h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (userRole === "admin") {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-full">
          {/* Welcome header section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div
              ref={welcomeRef}
              className="space-y-2 relative group overflow-hidden rounded-xl p-5"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-[2px] bg-slate-900 rounded-lg z-10"></div>
              <div className="relative z-20">
                <h2 className="text-2xl text-slate-400">
                  Great to see you again, Admin!
                </h2>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
                  {userName}
                </h1>
              </div>
            </div>

            <div welssName="flex items-center gap-4">
              <button
                onClick={handleCreateInterview}
                className="relative inline-flex items-center gap-2 px-6 py-3 text-white overflow-hidden rounded-xl group h-[88px] "
              >
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
                <Plus className="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative font-semibold transition-all duration-300 group-hover:tracking-wider">
                  Create Interview
                </span>
              </button>
              <div
                ref={timeRef}
                className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700 relative group overflow-hidden h-[88px] "
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-[2px] bg-slate-800 rounded-2xl z-10"></div>
                <div className="relative z-20 transform group-hover:-translate-y-1 transition-transform duration-300">
                  <p className="text-sm text-slate-400 group-hover:text-white transition-colors duration-300">
                    Current Time
                  </p>
                  <p className="text-2xl font-bold text-white">{currentTime}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-slate-800/50 p-4 rounded-2xl backdrop-blur-sm border border-slate-700 relative group overflow-hidden hover:bg-red-500/10 transition-colors duration-300  flex items-center justify-center"
              >
                <LogOut className="w-6 h-6 text-white group-hover:text-red-500 transition-colors duration-300" />
              </button>
            </div>
          </div>

          {/* Metrics cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {[
              {
                title: "Total Interviews Created",
                value: dashboardData?.totalInterviews?.length || "N/A",
                isLoading: loading,
              },
              {
                title: "Completed Interviews",
                value: dashboardData?.completedInterviews?.length || "N/A",
                isLoading: loading,
              },
              {
                title: "Completion Rate",
                value: `${dashboardData?.completionPercentage || 0}%`,
                isLoading: loading,
              },
            ].map((metric, index) => (
              <Card
                key={index}
                className="bg-slate-800 border-slate-700 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-[2px] bg-slate-800 rounded-lg z-10"></div>
                <div className="relative z-20 p-6">
                  <h3 className="text-slate-400 text-sm">{metric.title}</h3>
                  {metric.isLoading ? (
                    <div className="text-3xl font-bold text-white mt-2">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className="text-3xl font-bold text-white mt-2">
                      {metric.value}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700 ">
              <CardHeader>
                <CardTitle className="text-white">Skills Analysis</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <Chart
                    options={performanceChartOptions}
                    series={performanceSeries}
                    type="polarArea"
                    height="100%"
                  />
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Success Rating Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <Chart
                    options={donutChartOptions}
                    series={donutSeries}
                    type="donut"
                    height="100%"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // For non-admin users
  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-full">
        {/* Welcome header section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div
            ref={welcomeRef}
            className="space-y-2 relative group overflow-hidden rounded-xl p-5"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-[2px] bg-slate-900 rounded-lg z-10"></div>
            <div className="relative z-20 transform group-hover:-translate-y-1 transition-transform duration-300">
              <h2 className="text-2xl text-slate-400 group-hover:text-white transition-colors duration-300">
                Welcome back,
              </h2>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text transform group-hover:scale-105 transition-transform duration-300">
                {userName}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div ref={welcomeRef} className="flex items-center gap-4">
              <button
                onClick={handleCreateInterview}
                className="relative inline-flex items-center gap-2 px-6 py-3 text-white overflow-hidden rounded-xl group h-[100px] "
              >
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
                <Plus className="relative w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="relative font-semibold transition-all duration-300 group-hover:tracking-wider">
                  Create Interview
                </span>
              </button>
            </div>
            <div
              ref={timeRef}
              className="bg-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-slate-700 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-[2px] bg-slate-800 rounded-2xl z-10"></div>
              <div className="relative z-20 transform group-hover:-translate-y-1 transition-transform duration-300">
                <p className="text-sm text-slate-400 group-hover:text-white transition-colors duration-300">
                  Current Time
                </p>
                <p className="text-2xl font-bold text-white">{currentTime}</p>
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

        {/* Performance metrics card */}
        <Card className="col-span-full md:col-span-2 bg-slate-800 border-slate-700 mb-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute inset-[2px] bg-slate-800 rounded-lg z-10"></div>
          <div className="relative z-20">
            <CardHeader>
              <CardTitle className="text-white">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Total Interviews",
                    value: loading ? (
                      <LoadingSpinner />
                    ) : (
                      dashboardData?.totalInterviews?.length
                    ),
                  },
                  {
                    title: "Completion Rate",
                    value: loading ? (
                      <LoadingSpinner />
                    ) : (
                      `${dashboardData?.completionPercentage || 0}%`
                    ),
                  },
                  {
                    title: "Average Rating",
                    value: loading ? (
                      <LoadingSpinner />
                    ) : (
                      dashboardData?.averageRating || "N/A"
                    ),
                  },
                ].map((metric, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/50 p-6 rounded-xl relative group/metric overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover/metric:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute inset-[2px] bg-slate-700/50 rounded-xl z-10"></div>
                    <div className="relative z-20 transform group-hover/metric:-translate-y-1 transition-transform duration-300">
                      <p className="text-sm text-slate-400 group-hover/metric:text-white transition-colors duration-300">
                        {metric.title}
                      </p>
                      {metric.isLoading ? (
                        <div className="text-3xl font-bold text-white mt-2">
                          <LoadingSpinner />
                        </div>
                      ) : (
                        <div className="text-3xl font-bold text-white mt-2">
                          {metric.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 ">
          <Card className="bg-slate-800 border-slate-700 ">
            <CardHeader>
              <CardTitle className="text-white">Skills Analysis</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <Chart
                  options={performanceChartOptions}
                  series={performanceSeries}
                  type="polarArea"
                  height="100%"
                />
              )}
            </CardContent>
          </Card>

          {/* <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Success Rating Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <Chart
                  options={donutChartOptions}
                  series={donutSeries}
                  type="donut"
                  height="100%"
                />
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}

export default withauth(Hero);
