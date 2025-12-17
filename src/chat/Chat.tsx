import React from "react";
import { useState, useEffect } from "react";
import { Form, Input } from "@heroui/react";
import api from "@/api";
import Language from "@/components/language";
interface ChatResponse {
  response: string;
  intent: string;
}

function Chat() {
  const [response, setResponse] = useState<ChatResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [conversation, setConversation] = useState<
    Array<{
      role: "user" | "bot";
      message: string;
    }>
  >([]);
  const [language, setLanguage] = useState<string>("en");

  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  //testing pursposes
  // useEffect(() => {
  //   // Set some initial mock conversation data to test styling
  //   setConversation([
  //     { role: "user", message: "Hello, I'm looking for jobs in construction" },
  //     {
  //       role: "bot",
  //       message:
  //         "I found several construction jobs in your area. Here are some options: San Jose, CA - Job ID 3: Construction Helper. Description: Support carpenters and builders at construction sites. Requirements: Work permit (EAD), physically fit, safety training (can be provided).",
  //     },
  //     { role: "user", message: "What about restaurant jobs?" },
  //     {
  //       role: "bot",
  //       message:
  //         "San Francisco, CA - Job ID 2: Restaurant Server. Description: Serve food and drinks in a busy downtown restaurant. Requirements: Work permit (EAD), Customer service skills.",
  //     },
  //     { role: "user", message: "Do you have anything in Oakland?" },
  //     {
  //       role: "bot",
  //       message:
  //         "Oakland, CA - Job ID 1: Warehouse Worker. Description: Assist with packing, loading, and organizing shipments. Requirements: Work permit (EAD), Basic English preferred.",
  //     },
  //   ]);

  const showGreeting = !response;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsDisabled(true);
    let data = Object.fromEntries(new FormData(e.currentTarget));
    const userMessage = data.query as string;

    if (!userMessage.trim()) return;
    setConversation(prev => [...prev, { role: "user", message: userMessage }]);

    try {
      setIsTyping(true);
      setErrorMessage("");
      setLoadingMessage(language === "es" ? "Conectando con el servidor..." : "Connecting to server...");

      // First check if server is awake with a health check
      try {
        await api.get("/health", { timeout: 5000 });
        setLoadingMessage(language === "es" ? "Procesando tu solicitud..." : "Processing your request...");
      } catch (healthError) {
        // Server might be sleeping, inform user
        setLoadingMessage(
          language === "es"
            ? "El servidor está despertando, esto puede tomar 30-60 segundos..."
            : "Server is waking up, this may take 30-60 seconds..."
        );
      }

      const chatResponse = await api.post("/api/openai/chat", {
        message: userMessage,
        conversation_history: conversation.map(item => ({
          user: item.role === "user" ? item.message : "",
          hunter_bot: item.role === "bot" ? item.message : "",
        })),
        language,
      });

      let responseData;

      try {
        if (Array.isArray(chatResponse.data)) {
          // If the response is an array of characters, join them and parse as JSON
          const responseString = chatResponse.data.join("");
          responseData = JSON.parse(responseString);
        } else if (typeof chatResponse.data === "string") {
          // If it's already a string, parse it
          responseData = JSON.parse(chatResponse.data);
        } else {
          // If it's an object, use it directly
          responseData = chatResponse.data;
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        // Fallback to a default response if parsing fails
        responseData = {
          response: "Sorry, I received a response but couldn't process it correctly.",
          intent: "error",
        };
      }

      // Update response state with parsed data
      setResponse(responseData);

      // Add bot message to conversation
      setConversation(prev => [
        ...prev,
        {
          role: "bot",
          message: responseData.response || "Sorry, I couldn't process that request.",
        },
      ]);

      setIsTyping(false);
      setLoadingMessage("");
      setIsDisabled(false);
    } catch (error: any) {
      console.error("Error fetching chat response:", error);

      // Provide helpful error messages based on the error type
      if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
        setErrorMessage(
          language === "es"
            ? "La solicitud tardó demasiado. El servidor gratuito puede estar despertando. Por favor, intenta de nuevo en un momento."
            : "Request timed out. The free-tier server may be waking up. Please try again in a moment."
        );
      } else if (error.message.includes("Network Error")) {
        setErrorMessage(
          language === "es"
            ? "Error de conexión. Por favor verifica tu conexión a internet e intenta de nuevo."
            : "Connection error. Please check your internet connection and try again."
        );
      } else {
        setErrorMessage(
          language === "es"
            ? "Algo salió mal. Por favor intenta de nuevo."
            : "Sorry, something went wrong. Please try again."
        );
      }

      setIsTyping(false);
      setLoadingMessage("");
      setIsDisabled(false);
    }
  };

  let headerText = "";
  if (language === "es") {
    headerText = "¿Cómo puedo ayudarte hoy?";
  } else if (language === "zh") {
    headerText = "今天我能为您做些什么？";
  } else {
    headerText = "How can I help you today?";
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-800 rounded-lg shadow-lg flex flex-col h-[800px]">
      <div className="mb-4 flex justify-center">
        <Language language={language} setLanguage={setLanguage} isDisabled={isDisabled} />
      </div>

      {showGreeting && conversation.length === 0 && (
        <div className="text-white text-center text-xl font-semibold py-4">{headerText}</div>
      )}

      <div className="flex-grow overflow-y-auto mb-4 pr-2" style={{ scrollBehavior: "smooth" }}>
        <div className="flex flex-col space-y-4">
          {conversation.map((item, index) => (
            <div key={index} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-3/4 p-3 rounded-lg ${
                  item.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-700 text-white rounded-bl-none"
                }`}
              >
                {item.role === "bot" && (
                  <div className="flex items-center mb-1">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                      <span className="text-white font-bold text-xs">HB</span>
                    </div>
                    <span className="text-xs text-gray-300">Hunter Bot</span>
                    {index === conversation.length - 1 && response?.intent && (
                      <span className="ml-2 px-2 py-0.5 bg-indigo-700 text-xs rounded-full text-white">
                        {response.intent}
                      </span>
                    )}
                  </div>
                )}
                <p>{item.message}</p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-700 text-white p-3 rounded-lg rounded-bl-none">
                <div className="flex items-center mb-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-xs">HB</span>
                  </div>
                  <span className="text-xs text-gray-300">Hunter Bot</span>
                </div>
                {loadingMessage && <p className="text-sm text-yellow-300 mb-2 italic">{loadingMessage}</p>}
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "100ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "200ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Form
          onSubmit={e => {
            handleSubmit(e);
            e.currentTarget.reset();
          }}
        >
          <Input
            type="text"
            placeholder="Type a message..."
            name="query"
            className="w-full p-3 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            disabled={isTyping}
          />
          <button
            type="submit"
            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
            disabled={isTyping}
          >
            Send
          </button>
        </Form>
        {errorMessage && <div className="text-red-500 mt-2 text-sm">{errorMessage}</div>}
      </div>
    </div>
  );
}

export default Chat;
