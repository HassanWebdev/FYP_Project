"use client";
import "regenerator-runtime/runtime";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Custom/Navbar";
import { message } from "antd";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { PhoneOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  CreateAssistant,
  CreateThread,
  CreateMessage,
  Run,
  AIResponse,
} from "@/lib/helperfunctions";
import { useRouter } from "next/navigation";

const MockMasterAI = ({ params }) => {
  console.log(params);
  const [text, setText] = useState("");
  const AIIds = useRef({
    threadId: "",
    assistantId: "",
    runId: "",
    messageId: "",
  });
  const [speaking, setSpeaking] = useState("ai");
  const [isRecording, setIsRecording] = useState(false);
  const [AIMessage, setAIMessage] = useState("");

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    continuous: true,
  });

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      message.warning("Browser doesn't support speech recognition.");
      return;
    }

    SpeechRecognition.startListening({ continuous: true });

    return () => {
      SpeechRecognition.stopListening();
    };
  }, []);

  useEffect(() => {
    let silenceTimer;

    if (transcript) {
      setSpeaking("user");
      setIsRecording(true);
      if (silenceTimer) clearTimeout(silenceTimer);

      silenceTimer = setTimeout(() => {
        setIsRecording(false);
        setText(transcript);
        resetTranscript();
      }, 2000);
    }

    return () => {
      if (silenceTimer) clearTimeout(silenceTimer);
    };
  }, [transcript]);

  const createassistant = async () => {
    const assistant = await CreateAssistant();
    AIIds.current.assistantId = assistant?.assistant?.id;
    console.log(assistant);
  };

  const Createthread = async () => {
    const thread = await CreateThread(AIIds.current.assistantId);
    AIIds.current.threadId = thread?.id;
    console.log(thread);
  };
  const Createmessage = async () => {
    console.log("text", text);
    if (text.trim() === "") return;
    try {
      const message = await CreateMessage(AIIds.current.threadId, text);
      AIIds.current.messageId = message.id;
      console.log(message);
      const run = await Run(AIIds.current.threadId, AIIds.current.assistantId);
      AIIds.current.runId = run.id;
      console.log(run);
      while (text.trim() !== "") {
        const response = await AIResponse(
          AIIds.current.threadId,
          AIIds.current.runId
        );
        console.log(response);
        if (response?.status === "completed") {
          setAIMessage(response?.message);
          setText("");
          console.log("AI Message", response?.message);
          resetTranscript();
          break;
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    createassistant();
    Createthread();
  }, []);

  useEffect(() => {
    console.log(AIIds.current);
  }, [AIIds.current]);

  useEffect(() => {
    Createmessage();
  }, [text]);

  useEffect(() => {
    if (AIMessage?.trim() !== "") {
      console.log("i am here");
      const utterance = new SpeechSynthesisUtterance(AIMessage);

      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find((voice) => voice.lang === "hi-IN");
      if (indianVoice) {
        utterance.voice = indianVoice;
      }
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [AIMessage]);

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {/* Animated Background Waves */}
      <div className="absolute inset-0 opacity-20">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-blue-500/20 to-transparent"
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 5,
              delay: i * 0.5,
              repeat: Infinity,
            }}
            style={{
              transform: `translateY(${i * 40}px)`,
            }}
          />
        ))}
      </div>
      <Navbar background={"bg-[#0F172A] text-white"} />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center gap-8 h-[400px]">
          {/* User Side */}
          <Card className="flex-1 h-full bg-slate-800/50 border-slate-700 relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent"></div>

            <div className="h-full flex flex-col items-center justify-center relative">
              <motion.div
                className={`w-48 h-48 rounded-full overflow-hidden mb-6 ${
                  speaking === "user"
                    ? "ring-4 ring-purple-500 ring-opacity-60"
                    : ""
                }`}
                animate={
                  speaking === "user"
                    ? {
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 0 0px rgba(168,85,247,0.4)",
                          "0 0 0 20px rgba(168,85,247,0)",
                          "0 0 0 0px rgba(168,85,247,0.4)",
                        ],
                      }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                <img
                  src="https://randomuser.me/api/portraits/men/1.jpg"
                  alt="User"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {speaking === "user" && (
                <div className="flex gap-1 mt-4">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [
                          "15px",
                          `${Math.random() * 30 + 20}px`,
                          "15px",
                        ],
                        backgroundColor: [
                          "rgb(168,85,247)",
                          "rgb(139,92,246)",
                          "rgb(168,85,247)",
                        ],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-2 bg-purple-500 rounded-full"
                    />
                  ))}
                </div>
              )}

              {isRecording && (
                <div className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg">
                  Recording...
                </div>
              )}
              {transcript && (
                <p className="mt-4 text-white text-sm">{transcript}</p>
              )}
            </div>
          </Card>

          {/* AI Side */}
          <Card className="flex-1 h-full bg-slate-800/50 border-slate-700 relative overflow-hidden group backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"></div>

            <div className="h-full flex flex-col items-center justify-center relative">
              <motion.div
                className={`w-48 h-48 rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 p-1 mb-6 ${
                  speaking === "ai"
                    ? "ring-4 ring-blue-500 ring-opacity-60"
                    : ""
                }`}
                animate={
                  speaking === "ai"
                    ? {
                        rotate: [0, 360],
                        borderRadius: ["50%", "45%", "50%"],
                      }
                    : {}
                }
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                  <motion.div
                    animate={{
                      scale: speaking === "ai" ? [1, 1.1, 1] : 1,
                      rotate: speaking === "ai" ? [0, -360] : 0,
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <svg
                      width="100"
                      height="100"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      className="text-blue-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>

              {speaking === "ai" && (
                <div className="flex gap-1 mt-4">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [
                          "15px",
                          `${Math.random() * 30 + 20}px`,
                          "15px",
                        ],
                        backgroundColor: [
                          "rgb(59,130,246)",
                          "rgb(96,165,250)",
                          "rgb(59,130,246)",
                        ],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                      className="w-2 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>{" "}
      {/* End Call Button */}
      <motion.button
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-slate-800/90 to-slate-900/90 hover:from-slate-700/90 hover:to-slate-800/90 text-white px-8 py-4 rounded-xl flex items-center gap-3 border border-slate-600/50 shadow-lg backdrop-blur-sm group transition-all duration-300"
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <PhoneOff className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
        </motion.div>
        <span className="font-medium tracking-wide text-slate-200 group-hover:text-white transition-colors duration-300">
          Terminate Session
        </span>
      </motion.button>
    </div>
  );
};

export default MockMasterAI;
