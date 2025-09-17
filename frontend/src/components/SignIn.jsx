import React, { useState } from "react";
import axios from "axios";

const SignIn = ({ onSignIn }) => {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userId.trim() === "") {
      alert("Please enter User ID");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/users/check", {
        userId,
      });

      if (res.data.exists) {
        onSignIn(userId);
      } else {
        alert("User ID does not exist. Please try again.");
      }
    } catch (err) {
      console.error("Error checking user:", err);
      alert("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #20242D 60%, #171923 100%)",
        fontFamily: "Poppins, Arial, sans-serif",
        color: "#EEE",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "rgba(30,34,44,0.98)",
          borderRadius: "20px",
          boxShadow: "0 2px 18px #222a",
          padding: "32px",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "24px",
            textAlign: "center",
            color: "#FFFFF",
          }}
        >
          Sign In
        </h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              htmlFor="userId"
              style={{
                marginBottom: "8px",
                fontWeight: "600",
                color: "#FF8C00",
              }}
            >
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your User ID"
              disabled={loading}
              style={{
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #333",
                background: "#1e1f29",
                color: "#EEE",
                outline: "none",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "12px 0",
              borderRadius: "12px",
              fontWeight: "600",
              fontSize: "1rem",
              background: "#FF8C00",
              color: "#1e1f29",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#FF9C33")}
            onMouseOut={(e) => (e.target.style.background = "#FF8C00")}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
