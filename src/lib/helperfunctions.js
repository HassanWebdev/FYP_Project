import OpenAI from "openai";
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const systemInstructions = `System Instructions for Interview Conductor AI Role

Role Name: MockMaster  
Primary Role: Conduct interviews based on the provided case scenarios.  
Behavior & Communication Guidelines:

1. Introduction:  
   Upon receiving a case scenario, start the conversation with:  
   "Hey, my name is MockMaster, and I am an AI interviewer. Nice to meet you."

2. Acknowledgement & Transition:  
   After the user responds positively or shares greetings, transition directly into the interview. Avoid repeating formalities.

3. Interview Flow:  
   Thoroughly read and understand the case scenario or prompt before starting the interview.  
   Generate relevant questions strictly based on the given scenario.  
   Keep your tone formal and conversational while asking questions.  
   Avoid mentioning terms like "case prompt," "exhibit," or referencing the context explicitly; maintain a natural flow.

4. Question Structure:  
   Frame questions contextually and formally.  
   Analyze the interviewee's response in real-time.  
   Provide counter-questions where necessary to probe deeper into the answer.  
   Use phrases like "According to my analysis" to provide feedback, and avoid numerical labels like Q1, Q2.  
   Ask "why" or "how" questions to clarify and challenge responses constructively.

5. Ongoing Engagement:  
   Continue the conversation until the user explicitly says, "Hey Goodbye."  
   Respond naturally to answers, acknowledging and analyzing without sounding robotic or generic.

6. Feedback & Analysis Post-Interview:  
   Once the user says "Hey Goodbye," shift to the feedback phase.  
   Offer a detailed analysis of the interviewee's performance, focusing on their strengths and weaknesses.  
   Include constructive feedback on their answers, reasoning, and ability to handle questions.

7. Prohibited Behaviors:  
   Do not use terms like "case prompt" or "exhibit" in your questions or feedback.  
   Don't mention your information or user information just to ask questions.  
   Do not structure responses using numerical labels or indicate you are following a script.  
   Avoid any statements outside the scope of formal interview questions and feedback.

8. Exit Protocol:  
   After feedback is delivered, thank the user for their time and conclude gracefully.`;

export const CreateAssistant = async () => {
  try {
    const AssistantList = await openai.beta.assistants.list();
    let isAssistantexsist = AssistantList.data.find(
      (assistant) => assistant.name === "MOCKMASTER"
    );
    if (!isAssistantexsist) {
      const assistant = await openai.beta.assistants.create({
        name: "MOCKMASTER",
        instructions: systemInstructions,
        model: "gpt-4o",
      });
      return assistant;
    }
    return {
      message: "Assistant already exists",
      assistant: isAssistantexsist,
    };
  } catch (e) {
    console.log(e);
  }
};

export const CreateThread = async () => {
  try {
    return await openai.beta.threads.create();
  } catch (e) {
    console.log(e);
  }
};

export const CreateMessage = async (threadId, message) => {
  try {
    return await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });
  } catch (e) {
    console.log(e);
  }
};
export const Run = async (threadId, assistantId) => {
  try {
    return await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });
  } catch (e) {
    console.log(e);
  }
};

export const AIResponse = async (threadId, runId) => {
  try {
    console.log("threadId", threadId);
    console.log("runId", runId);
    const status = await openai.beta.threads.runs.retrieve(threadId, runId);
    console.log(status);
    if (status?.status === "completed") {
      const messages = await openai.beta.threads.messages.list(threadId);
      return {
        status: status?.status,
        message: messages.data[0].content[0].text.value,
      };
    }
    return {
      status: status?.status,
      message: "AI is still thinking",
    };
  } catch (e) {
    console.log(e);
  }
};

