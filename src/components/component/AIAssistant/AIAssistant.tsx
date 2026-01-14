"use client";

import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { X, Send, BotMessageSquare, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInitialMount = useRef(true);
  const isProcessing = useRef(false); // Prevent duplicate API calls

  // Load messages from localStorage on mount
  useEffect(() => {
    console.log("AI Assistant component mounted");
    const savedMessages = localStorage.getItem("ai-chat-history");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.error("Error loading chat history:", error);
        // Set default welcome message if loading fails
        setMessages([
          {
            id: "1",
            role: "assistant",
            content:
              "Hi! I'm your AI assistant for this website. I can help you find lyrics, learn about artists, or navigate the site. What would you like to know?",
            timestamp: new Date(),
          },
        ]);
      }
    } else {
      // Set default welcome message if no history exists
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "Hi! I'm your AI assistant for this website. I can help you find lyrics, learn about artists, or navigate the site. What would you like to know?",
          timestamp: new Date(),
        },
      ]);
    }
    // Mark initial mount as complete
    isInitialMount.current = false;
  }, []);

  // Save messages to localStorage whenever they change (skip initial mount)
  useEffect(() => {
    // Don't save during initial mount to prevent loop
    if (!isInitialMount.current && messages.length > 0) {
      localStorage.setItem("ai-chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const getPageType = useCallback(() => {
    const pathname = window.location.pathname;
    if (pathname === "/" || pathname === "/home") return "Home Page";
    if (pathname.startsWith("/artists")) return "Artists Page";
    if (pathname.startsWith("/lyrics")) return "Lyrics Page";
    if (pathname.startsWith("/search")) return "Search Page";
    if (pathname === "/about") return "About Page";
    if (pathname === "/contact") return "Contact Page";
    if (pathname === "/contribute") return "Contribute Page";
    return "Other Page";
  }, []);

  const getContentSummary = useCallback(() => {
    // Extract main headings
    const h1 = document.querySelector("h1")?.textContent || "";
    const h2Elements = document.querySelectorAll("h2");
    const h2Texts = Array.from(h2Elements)
      .slice(0, 3)
      .map((el) => el.textContent)
      .join(", ");

    return `Main heading: ${h1}. Section headings: ${h2Texts}`;
  }, []);

  const getPageContext = useCallback(() => {
    return {
      url: window.location.href,
      title: document.title,
      pageType: getPageType(),
      contentSummary: getContentSummary(),
    };
  }, [getPageType, getContentSummary]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isLoading || isProcessing.current) return;

    // Prevent duplicate calls
    isProcessing.current = true;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const context = getPageContext();

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          context,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.message,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      isProcessing.current = false; // Reset processing flag
    }
  }, [inputMessage, isLoading, getPageContext]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Parse markdown links and convert to JSX
  const parseMarkdownLinks = useCallback((text: string) => {
    const parts: (string | React.ReactElement)[] = [];
    let lastIndex = 0;

    // Regex to match markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      // Add the link
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <a
          key={match.index}
          href={linkUrl}
          className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = linkUrl;
          }}
        >
          {linkText}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  }, []);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div
          className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[9999] group"
          style={{ zIndex: 9999 }}
        >
          {/* Tooltip */}
          <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
              Ask AI Assistant
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full border-8 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
            </div>
          </div>

          {/* Button with enhanced effects */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative bg-gradient-to-r from-[#79095c33] to-[#001fff29] text-white rounded-full p-4 md:p-5 shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 hover:rotate-12 transition-all duration-500 ease-out animate-pulse-slow"
            aria-label="Open AI Assistant"
          >
            {/* Animated gradient border */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-75 blur-lg group-hover:opacity-100 transition-opacity duration-300 animate-spin-slow"></div>

            {/* Button content */}
            <div className="relative">
              <BotMessageSquare className="w-6 h-6 md:w-7 md:h-7 drop-shadow-lg" />
            </div>

            {/* Active indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 ring-2 ring-white shadow-lg"></span>
            </span>

            {/* Sparkle effect */}
            <span className="absolute -top-1 -left-1 h-3 w-3 bg-white rounded-full opacity-60 group-hover:animate-ping"></span>
          </button>
        </div>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed inset-4 md:bottom-6 md:left-6 md:inset-auto md:w-96 md:h-[600px] z-[9999] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-[#79095c33] to-[#001fff29] dark:from-[#79095c55] dark:to-[#001fff44] backdrop-blur-xl"
          style={{ zIndex: 9999 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BotMessageSquare className="w-6 h-6" />
              <div>
                <h3 className="font-semibold text-lg">AI Assistant</h3>
                <p className="text-xs opacity-90">Here to help you navigate</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 rounded-lg p-1.5 transition-colors"
              aria-label="Close AI Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap break-words">
                    {msg.role === "assistant"
                      ? parseMarkdownLinks(msg.content)
                      : msg.content}
                  </div>
                  <span
                    className={`text-xs mt-1 block ${
                      msg.role === "user"
                        ? "text-blue-100"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about this website..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-xl px-4 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              I can only help with website content
            </p>
          </div>
        </div>
      )}
    </>
  );
}
