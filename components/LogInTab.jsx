"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import SignInBtn from "./SignInBtn";

export default function LogInTab() {
  return (
    <div>
        <SignInBtn />
    </div>
  );
}
