"use client";

import { signIn } from "next-auth/react";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-muted p-8 shadow-lg bg-gradient-to-r from-[#79095c33] to-[#001fff29]">
      <h2 className="text-2xl font-bold text-center">Admin Login</h2>
      <p className="mt-2 text-muted-foreground text-center">
        Secure access for administrators only.
      </p>
      <Button
        onClick={() => signIn()}
        className="mt-6 flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-md hover:bg-primary-dark transition-all"
      >
        <LockIcon className="h-5 w-5" />
        Sign In
      </Button>
    </div>
  );
}
