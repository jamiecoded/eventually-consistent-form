"use client";

import { useState, useRef } from "react";

type Status = "idle" | "pending" | "retrying" | "success" | "error";

export default function Page() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ email?: string; amount?: string }>({});
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  const submitLock = useRef(false);

  const validateForm = () => {
    const newErrors: { email?: string; amount?: string } = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
    }

    const num = Number(amount);
    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(num) || num <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const submitForm = async () => {
    if (submitLock.current) return;

    const isValid = validateForm();
    if (!isValid) return;

    submitLock.current = true;

    const requestId = crypto.randomUUID();

    setActiveRequestId(requestId);
    setStatus("pending");

    await sendRequest(requestId, 0);

    submitLock.current = false;
  };

  const sendRequest = async (requestId: string, retryCount: number) => {
    try {
      const res = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, amount, requestId }),
      });

      if (!res.ok) throw new Error("temporary failure");

      setStatus("success");
      setActiveRequestId(null);
    } catch {
      if (retryCount < 3) {
        setStatus("retrying");

        setTimeout(() => {
          sendRequest(requestId, retryCount + 1);
        }, 1500);
      } else {
        setStatus("error");
        setActiveRequestId(null);
      }
    }
  };

  const statusColors: Record<Status, string> = {
    idle: "bg-yellow-400 text-black",
    pending: "bg-amber-500 text-black",
    retrying: "bg-blue-500 text-white",
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
  };

  const isLoading = status === "pending" || status === "retrying";

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-white relative px-4"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl tracking-[0.25em] font-light text-gray-300">
          EVENTUALLY
        </h1>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-wide">
          CONSISTENT FORM
        </h2>
      </div>

      <div className="relative z-10 w-[90%] sm:w-full max-w-md backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl transition-all duration-500">

        <input
          className={`w-full mb-2 px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white/10 text-center text-sm sm:text-base placeholder:text-gray-300 outline-none transition ${
            errors.email
              ? "ring-2 ring-red-500"
              : "focus:ring-2 focus:ring-white/20"
          }`}
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />

        {errors.email && (
          <p className="text-red-400 text-sm mb-3 text-center">
            {errors.email}
          </p>
        )}

        <input
          type="number"
          className={`w-full mb-2 px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-white/10 text-center text-sm sm:text-base placeholder:text-gray-300 outline-none transition ${
            errors.amount
              ? "ring-2 ring-red-500"
              : "focus:ring-2 focus:ring-white/20"
          }`}
          placeholder="Amount"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrors((prev) => ({ ...prev, amount: undefined }));
          }}
        />

        {errors.amount && (
          <p className="text-red-400 text-sm mb-4 text-center">
            {errors.amount}
          </p>
        )}

        <div className="flex justify-center mb-6">
          <span
            className={`px-5 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${statusColors[status]}`}
          >
            {status}
          </span>
        </div>

        <button
          onClick={submitForm}
          disabled={isLoading}
          className={`w-full py-3 sm:py-4 rounded-xl text-base sm:text-lg tracking-widest transition-all duration-300 ${
            isLoading
              ? "bg-black/30 cursor-not-allowed"
              : "bg-black hover:bg-black/50 active:scale-[0.97] shadow-xl"
          }`}
        >
          SUBMIT
        </button>
      </div>
    </main>
  );
}
