"use client";

import { useState } from "react";

// Type definitions for Sentiment and NSFW analysis results
type Sentiment = {
  label: string;
  score: number;
};

type NSFW = {
  label: string;
  score: number;
};

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [nsfw, setNsfw] = useState<NSFW | null>(null);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("");
  const [contextUpdateStatus, setContextUpdateStatus] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setLoading(true);
    setResponse("");
    setSentiment(null);
    setNsfw(null);

    try {
      const res = await fetch("http://localhost:5009/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch chatbot response.");
      }

      const data = await res.json();
      setResponse(data.reply);
      setSentiment(data.sentiment);
      setNsfw(data.nsfw);
    } catch (error) {
      setResponse("Error: Unable to communicate with the chatbot.");
    } finally {
      setLoading(false);
    }
  };

  const updateContext = async () => {
    if (!context.trim()) {
      alert("Please enter a context.");
      return;
    }

    setContextUpdateStatus("Updating...");

    try {
      const res = await fetch("http://localhost:5009/update_context", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ context }),
      });

      if (!res.ok) {
        throw new Error("Failed to update context.");
      }

      const data = await res.json();
      setContextUpdateStatus(data.message || "Context updated successfully!");
    } catch (error) {
      setContextUpdateStatus("Error: Unable to update context.");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Chat with BERT</h1>

      <textarea
        rows={4}
        cols={50}
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
      />
      <button
        onClick={sendMessage}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </button>
      <div style={{ marginTop: "20px" }}>
        <h2>Chatbot Response:</h2>
        <p>{response || "No response yet."}</p>
        {sentiment && (
          <>
            <h3>Sentiment Analysis:</h3>
            <p>Label: {sentiment.label}</p>
            <p>Score: {sentiment.score.toFixed(2)}</p>
          </>
        )}
        {nsfw && (
          <>
            <h3>NSFW Detection:</h3>
            <p>Label: {nsfw.label}</p>
            <p>Score: {nsfw.score.toFixed(2)}</p>
          </>
        )}
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h2>Update Context</h2>
      <textarea
        rows={4}
        cols={50}
        placeholder="Enter new context here..."
        value={context}
        onChange={(e) => setContext(e.target.value)}
        style={{ width: "100%", marginBottom: "10px", padding: "10px" }}
      />
      <button
        onClick={updateContext}
        style={{
          padding: "10px 20px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Update Context
      </button>
      <div style={{ marginTop: "10px" }}>
        <p>{contextUpdateStatus}</p>
      </div>
    </div>
  );
}
