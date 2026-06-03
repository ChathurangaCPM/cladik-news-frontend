import { Suspense } from "react";
import { SignupForm } from "@/components/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] p-6 md:p-10 relative overflow-hidden font-inter selection:bg-blue-100 selection:text-blue-900">
      {/* Immersive mesh grid and spots */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-blue-100/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-indigo-100/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10">
        <Suspense
          fallback={
            <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-sm text-slate-500 font-semibold font-inter">
              Initializing secure environment...
            </div>
          }
        >
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}
