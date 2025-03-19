"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [message, setMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  const submitSuggestions = async () => {
    setSubmitStatus("");
    if (!name || !email || !message) {
      setSubmitStatus("Please fill all the required fields");
      return;
    }

    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service_id: "myGmail",
        template_id: "template_dm43ind",
        user_id: "user_Mc5QI37PU2F55mUGiqmuO",
        template_params: {
          name: name,
          email: email,
          phone: phoneNo,
          message: message,
          subject: `New comments from ${name}`,
        },
      }),
    }).then((res) => {
      if (res.ok) {
        setSubmitStatus("Sent successfully");
        clearForm();
      } else {
        setSubmitStatus("error");
      }
    });
  };
  const clearForm = () => {
    setName("");
    setEmail("");
    setPhoneNo("");
    setMessage("");
  };

  return (
    <div className="bg-white px-6 py-12 sm:py-12 lg:px-8 bg-muted">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Contact Us
        </h2>
        <span
          onClick={() =>
            navigator.clipboard.writeText("tangkhullaalyrics@gmail.com")
          }
        >
          (tangkhullaalyrics@gmail.com)
        </span>
        <p className="mt-2 text-lg leading-8 text-gray-600">
          Questions? Comments? Let us know!
        </p>
      </div>
      {submitStatus && (
        <div
          className={`${
            submitStatus === "Sent successfully"
              ? "bg-green-100 text-green-700"
              : "bg-error text-error"
          } p-2 mt-4 rounded-md text-center`}
        >
          {submitStatus}
        </div>
      )}
      <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="first-name"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <Input
              id="first-name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={
                submitStatus === "Please fill all the required fields"
                  ? "border-error"
                  : ""
              }
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Email
          </label>
          <div className="mt-2">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={
                submitStatus === "Please fill all the required fields"
                  ? "border-error"
                  : ""
              }
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="phone-number"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Phone number
          </label>
          <div className="relative mt-2">
            <Input
              id="phone-number"
              placeholder="Enter your phone number"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="message"
            className="block text-sm font-semibold leading-6 text-gray-900"
          >
            Message
          </label>
          <div className="mt-2">
            <Textarea
              id="message"
              placeholder="Add comments/Suggestions"
              rows={8}
              required
              value={message}
              className={
                submitStatus === "Please fill all the required fields"
                  ? "border-error"
                  : ""
              }
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <Button
          type="submit"
          className="block w-full rounded-md px-3.5 py-2.5 text-center text-sm text-primary-foreground bg-primary transition"
          onClick={submitSuggestions}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
