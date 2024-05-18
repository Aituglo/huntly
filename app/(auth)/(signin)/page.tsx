import { Metadata } from "next";
import UserAuthForm from "@/components/forms/user-auth-form";

export const metadata: Metadata = {
  title: "Huntly",
  description: "The Bug Hunter Dashboard",
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
