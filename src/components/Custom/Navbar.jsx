"use client";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import withauth from "./withauth";

const Navbar = ({ background }) => {
  const [show, setshow] = useState(false);
  const [mobile, setmobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const tl = useRef(gsap.timeline({ paused: true }));
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.role === "admin") {
        setIsAdmin(true);
      }
    }
  }, []);

  useEffect(() => {
    const getwidth = () => {
      setmobile(window.innerWidth <= 768);
    };
    getwidth();
    window.addEventListener("resize", getwidth);
    return () => window.removeEventListener("resize", getwidth);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  useGSAP(() => {
    tl.current.to(".jk", { x: -60, duration: 0.4, ease: "none" }, 0);
    tl.current.to(".cd", { rotate: 720, duration: 0.4, ease: "none" }, 0);
  });

  const startanimate = () => tl.current.play();
  const stopanimate = () => tl.current.reverse();

  const drawer = () => {
    setshow((prevShow) => {
      const newShow = !prevShow;
      setIsDrawerOpen(newShow);
      gsap.to("#drawer", {
        duration: 0.5,
        translateX: newShow ? "0%" : "100%",
        ease: "power1.inOut",
      });
      return newShow;
    });
  };

  const NavLink = ({ href, children }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`text-xl overflow-hidden relative flex group px-4 py-2 rounded-lg ${
          isActive ? "bg-slate-800 text-white border border-slate-700" : ""
        }`}
      >
        <span
          className={`relative z-10 ${
            isActive
              ? "text-white"
              : "text-slate-400 group-hover:text-white transition-colors duration-300"
          }`}
        >
          {children}
        </span>
        {!isActive ? (
          <>
            <span className="absolute inset-0 bg-slate-800/50 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
            <span className="absolute inset-0 border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
          </>
        ) : (
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500"></span>
        )}
      </Link>
    );
  };

  return (
    <div
      className={`w-full ${
        mobile ? "px-5" : "px-10"
      } font-neue_montreal overflow-hidden py-4 flex justify-between ${background}  z-50`}
    >
      <Link href="/">
        {" "}
        <div
          className="logo flex"
          onMouseEnter={startanimate}
          onMouseLeave={stopanimate}
        >
          <div>
            <span className="cd px-1 inline-block">©</span>
          </div>
          <div className="w-[7.2rem] whitespace-nowrap overflow-hidden">
            <h1 className="jk font-neue_montreal_Medium">
              Code by Hassan Raza
            </h1>
          </div>
        </div>
      </Link>

      {mobile ? (
        <div className="fixed top-3 right-5 bg-black transition-all text-white hover:text-black hover:border-black hover:border-[1px] hover:bg-white rounded-full z-50">
          <button
            onClick={drawer}
            className="px-4 py-4 rounded-full flex justify-center items-center"
          >
            <AiOutlineMenu />
          </button>
          <div
            id="drawer"
            className="w-full z-50 h-screen overflow-hidden fixed top-0 right-0 bg-slate-900/95 backdrop-blur-sm text-white font-neue_montreal translate-x-full"
          >
            <div className="text-white relative w-full h-full px-4 flex flex-col justify-center items-center gap-8 overflow-y-auto">
              <div className="fixed left-5 top-5 rounded-full transition-all bg-slate-800 hover:bg-slate-700">
                <button
                  onClick={drawer}
                  className="p-4 text-slate-200 hover:text-white"
                >
                  <AiOutlineClose size={24} />
                </button>
              </div>

              <Link
                className="w-64 text-center font-neue_montreal_Medium relative overflow-hidden group px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700"
                href="/"
              >
                <span className="relative z-10 text-slate-200 group-hover:text-white transition-colors duration-300">
                  Dashboard
                </span>
              </Link>

              <Link
                className="w-64 text-center font-neue_montreal_Medium relative overflow-hidden group px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700"
                href="/Interviews"
              >
                <span className="relative z-10 text-slate-200 group-hover:text-white transition-colors duration-300">
                  Interviews
                </span>
              </Link>

              <Link
                className="w-64 text-center font-neue_montreal_Medium relative overflow-hidden group px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700"
                href="/My-Interviews"
              >
                <span className="relative z-10 text-slate-200 group-hover:text-white transition-colors duration-300">
                  My Interviews
                </span>
              </Link>

              {isAdmin && (
                <Link
                  className="w-64 text-center font-neue_montreal_Medium relative overflow-hidden group px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700"
                  href="/admin/created-interviews"
                >
                  <span className="relative z-10 text-slate-200 group-hover:text-white transition-colors duration-300">
                    Created Interviews
                  </span>
                </Link>
              )}

              <Link
                className="w-64 text-center font-neue_montreal_Medium relative overflow-hidden group px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700"
                href="/Interviews/generate"
              >
                <span className="relative z-10 text-slate-200 group-hover:text-white transition-colors duration-300">
                  Generate Interview
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="links flex gap-5">
          {[
            { name: "Dashboard", url: "/" },
            { name: "Interviews", url: "/Interviews" },
            { name: "My Interviews", url: "/My-Interviews" },
            ...(isAdmin ? [{ name: "Created Interviews", url: "/admin/created-interviews" }] : []),
          ].map((item, indx) => (
            <NavLink key={indx} href={item.url}>
              {item.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default withauth(Navbar);
