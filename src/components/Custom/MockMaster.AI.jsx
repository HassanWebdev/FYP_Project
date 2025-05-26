"use client";
import "regenerator-runtime/runtime";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "@/components/Custom/Navbar";
import { message } from "antd";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mic, MicOff, PhoneOff } from "lucide-react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import axios from "@/lib/axioshttp";
import {
  CreateAssistant,
  CreateThread,
  CreateMessage,
  Run,
  AIResponse,
} from "@/lib/helperfunctions";
import AWS from "aws-sdk";
import { useRouter } from "next/navigation";
import { result } from "lodash";
import { toast } from "react-toastify";

const MockMasterAI = ({ params }) => {
  console.log(params);
  const polyytwo = new AWS.Polly();
  const user = JSON.parse(localStorage.getItem("user"));
  const [text, setText] = useState("");
  const [speaking, setSpeaking] = useState(" ");
  const [isRecording, setIsRecording] = useState(false);
  const [AIMessage, setAIMessage] = useState("");
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [CaseScenario, setCaseScenario] = useState({ scenario: "" });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [polly, setPolly] = useState(null);
  const [aiconnectloading, setAiconnectloading] = useState(true);
  const router = useRouter();
  const audioRef = useRef(null);
  const [interviewTitle, setInterviewTitle] = useState("");
  const[caseId, setCaseId] = useState(params?.id || "");

  const AIIds = useRef({
    threadId: "",
    assistantId: "",
    runId: "",
    messageId: "",
  });

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  useEffect(() => {
    const setupAudioListeners = () => {
      if (!audioRef.current) return;

      const handlePlay = () => {
        console.log("Audio started playing");
        setIsAiSpeaking(true);
        setSpeaking("ai");
        SpeechRecognition.stopListening();
      };

      const handleEnded = () => {
        console.log("Audio ended");
        setIsAiSpeaking(false);
        setSpeaking("user");
        if (!isMuted && !isTerminated) {
          SpeechRecognition.startListening({ continuous: true });
        }
      };

      const handleError = (e) => {
        console.error("Audio playback error:", e);
        setIsAiSpeaking(false);
        if (!isMuted && !isTerminated) {
          SpeechRecognition.startListening({ continuous: true });
        }
      };

      audioRef.current.addEventListener("play", handlePlay);
      audioRef.current.addEventListener("ended", handleEnded);
      audioRef.current.addEventListener("error", handleError);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("play", handlePlay);
          audioRef.current.removeEventListener("ended", handleEnded);
          audioRef.current.removeEventListener("error", handleError);
        }
      };
    };

    const cleanup = setupAudioListeners();
    return cleanup;
  }, [isMuted, isTerminated]);

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      message.warning("Browser doesn't support speech recognition.");
      return;
    }
    return () => SpeechRecognition.stopListening();
  }, []);

  useEffect(() => {
    if (isMuted || aiconnectloading || isAiSpeaking || isTerminated) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  }, [isMuted, aiconnectloading, isAiSpeaking, isTerminated]);

  useEffect(() => {
    AWS.config.update({
      region: "us-east-1",
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });

    setPolly(new AWS.Polly());
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
  };

  const Createthread = async () => {
    const thread = await CreateThread(AIIds.current.assistantId);
    AIIds.current.threadId = thread?.id;
  };

  const Createmessage = useCallback(
    async (messageText) => {
      if (!messageText?.trim()) return;
      try {
        const message = await CreateMessage(
          AIIds.current.threadId,
          messageText
        );
        AIIds.current.messageId = message.id;

        const run = await Run(
          AIIds.current.threadId,
          AIIds.current.assistantId
        );
        AIIds.current.runId = run.id;

        while (true) {
          const response = await AIResponse(
            AIIds.current.threadId,
            AIIds.current.runId
          );

          if (response?.status === "completed") {
            setAIMessage(response?.message);
            setText("");
            resetTranscript();
            break;
          }
        }
      } catch (error) {
        console.error(error);
        message.error("Error communicating with AI. Please try again.");
      }
    },
    [AIIds.current.threadId, AIIds.current.assistantId]
  );

  useEffect(() => {
    const fetchCaseScenario = async () => {
      try {
        const response = await axios.post(`/GetInterviews/specificInterview`, {
          interviewId: params?.id,
          role: params.role ? params.role : "user",
        });
        setInterviewTitle(response?.data?.data?.title);

        setCaseScenario({ scenario: response?.data?.data?.scenario });
      } catch (error) {
        console.error(error);
        message.error("Failed to fetch interview scenario.");
      }
    };
    fetchCaseScenario();
  }, [params]);

  useEffect(() => {
    const initializeAI = async () => {
      if (CaseScenario.scenario && !isInitialized && (polly || polyytwo)) {
        try {
          await createassistant();
          await Createthread();
          await Createmessage(JSON.stringify(CaseScenario));
          setIsInitialized(true);
        } catch (error) {
          console.error("Failed to initialize AI:", error);
          message.error(
            "Failed to initialize AI. Please refresh and try again."
          );
        }
      }
    };
    initializeAI();
  }, [CaseScenario.scenario, isInitialized, polly]);

  useEffect(() => {
    if (isInitialized && text) {
      Createmessage(text);
    }
  }, [text, isInitialized, Createmessage]);

  const generateFeedback = async (messageText = "Hey Goodbye") => {
    if (!messageText?.trim()) return;
    try {
      const message = await CreateMessage(AIIds.current.threadId, messageText);
      AIIds.current.messageId = message.id;

      const run = await Run(AIIds.current.threadId, AIIds.current.assistantId);
      AIIds.current.runId = run.id;

      while (true) {
        const response = await AIResponse(
          AIIds.current.threadId,
          AIIds.current.runId
        );
        console.log(response);
        if (response?.status === "completed") {
          console.log("Feedback response:", response);
          storeFeedback(response?.message);
          break;
        }
      }
    } catch (error) {
      console.error(error);
      message.error("Error communicating with AI. Please try again.");
    }
  };

  // Regex to extract the result object from the string
  function extractResultObject(inputString) {
    // This regex captures the result object content between ```plaintext and ``` tags
    const resultRegex = /```plaintext\s*result:\s*(\{[\s\S]*?\})\s*```/;
    const match = inputString.match(resultRegex);

    if (match && match[1]) {
      try {
        // Convert the matched string into a valid JSON format
        const jsonStr = match[1]
          .replace(/(\w+):/g, '"$1":') // Convert property names to quoted strings
          .replace(/'/g, '"') // Replace single quotes with double quotes
          .replace(/(\s*default:\s*)('[^']*'|"[^"]*"|[^,}\s]+)/g, '$1"$2"') // Handle default values
          .replace(/(\s*enum:\s*)\[(.*?)\]/g, (_, p1, p2) => {
            // Process enum arrays
            const enumValues = p2
              .split(",")
              .map((v) =>
                v.trim().startsWith("'") || v.trim().startsWith('"')
                  ? v.trim()
                  : `"${v.trim()}"`
              )
              .join(",");
            return `${p1}[${enumValues}]`;
          })
          .replace(/(\s*type:\s*)(\w+)/g, '$1"$2"'); // Quote type values

        // Parse the formatted string into a JavaScript object
        return JSON.parse(`{"result":${jsonStr}}`);
      } catch (e) {
        console.error("Error parsing the result object:", e);
        return null;
      }
    }
    return null;
  }

  const storeFeedback = async (feedback) => {
    const parsedFeedback = await extractResultObject(feedback);
    console.log(parsedFeedback);
    try {
      const storeFeedback = params?.role
        ? await axios.post("/StoreMockResult", {
          mockInterviewId: params?.id,
          result: parsedFeedback,
          userId: user?.id,
          })
        : await axios.post("/storeFeedback", {
            result: parsedFeedback,
            caseId: params?.id,
          });
      console.log("Feedback stored:", storeFeedback);
      toast.success("Feedback stored successfully");
    } catch (e) {
      console.error("Error storing feedback:", e);
    }
  };

  useEffect(() => {
    if (AIMessage?.trim() !== "" && (polly || polyytwo)) {
      if (isTerminated) {
        generateFeedback();
        return;
      }

      try {
        const params = {
          Text: AIMessage,
          OutputFormat: "mp3",
          VoiceId: "Matthew",
          Engine: "generative",
        };

        polly.synthesizeSpeech(params, (err, data) => {
          if (err) {
            console.error("Error with Polly:", err);
            setAiconnectloading(false);
            return;
          }

          const uInt8Array = new Uint8Array(data.AudioStream);
          const blob = new Blob([uInt8Array.buffer], {
            type: data.ContentType,
          });
          const url = URL.createObjectURL(blob);
          setAiconnectloading(false);

          if (audioRef.current) {
            audioRef.current.src = url;
            audioRef.current.load();

            setTimeout(() => {
              const playPromise = audioRef.current.play();

              if (playPromise !== undefined) {
                playPromise.catch((error) => {
                  console.error("Error playing audio:", error);

                  setIsAiSpeaking(false);
                  if (!isMuted && !isTerminated) {
                    SpeechRecognition.startListening({ continuous: true });
                  }
                });
              }
            }, 100);
          }
        });
      } catch (err) {
        console.error("Error processing AI speech:", err);
        setAiconnectloading(false);
      }
    }
  }, [AIMessage, polly, isMuted, isTerminated]);

  const terminateSession = () => {
    setIsTerminated(true);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    SpeechRecognition.stopListening();
    resetTranscript();
    setAiconnectloading(true);
  };

  const renderAudio = () => <audio ref={audioRef} className="hidden" />;

  if (aiconnectloading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900">
        {renderAudio()}
        <div className="bg-slate-800/90 p-8 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col items-center gap-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-blue-500 border-t-transparent"
            />
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-2">
                {isTerminated ? "Generating the Feedback" : "Connecting to AI"}
              </h2>
              <p className="text-slate-400">
                {isTerminated
                  ? "Please wait while AI analyzes your performance"
                  : " Please wait while we establish a secure connection..."}
              </p>
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-3 h-3 rounded-full bg-blue-500"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] relative overflow-hidden">
      {renderAudio()}
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
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-4">
        {/* End Call Button */}
        <motion.button
          onClick={terminateSession}
          className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 hover:from-slate-700/90 hover:to-slate-800/90 text-white px-8 py-4 rounded-xl flex items-center gap-3 border border-slate-600/50 shadow-lg backdrop-blur-sm group transition-all duration-300"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            <PhoneOff className="w-6 h-6 text-red-400 group-hover:text-red-300 transition-colors duration-300" />
          </motion.div>
        </motion.button>

        {/* Mute Button */}
        <motion.button
          className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 hover:from-slate-700/90 hover:to-slate-800/90 text-white p-4 rounded-xl flex items-center gap-3 border border-slate-600/50 shadow-lg backdrop-blur-sm group transition-all duration-300"
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => setIsMuted(!isMuted)}
          disabled={isAiSpeaking}
        >
          <motion.div
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            className="relative"
          >
            {isMuted || isAiSpeaking ? (
              <MicOff
                className={`w-6 h-6 ${
                  isAiSpeaking
                    ? "text-gray-400"
                    : "text-red-400 group-hover:text-red-300"
                } transition-colors duration-300`}
              />
            ) : (
              <Mic className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Status Indicator */}
      <div className="absolute top-20 right-4 px-4 py-2 bg-slate-800/80 rounded-lg border border-slate-700 text-white backdrop-blur-sm">
        {isAiSpeaking
          ? "AI is speaking..."
          : isMuted
          ? "Microphone muted"
          : "Listening..."}
      </div>
    </div>
  );
};

export default MockMasterAI;
