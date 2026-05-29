import { Meteors } from "@/components/custom/news/Meteors";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import { LangToggle } from "@/components/custom/news/LangToggle";
import { FloatingBusiness } from "@/components/custom/news/FloatingBusiness";
import Link from "next/link";
import Image from "next/image";

export default function NewsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative overflow-hidden min-h-screen  dark:bg-black text-slate-900 dark:text-zinc-50 transition-colors duration-300">
      {/* Immersive Background Layering */}
      <div className="absolute inset-0 z-0 h-[90vh]">
        {/* Mesh Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_40%,#000_20%,transparent_100%)] opacity-30 dark:opacity-100" />

        {/* Expansive Aurora Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[160px] rounded-full opacity-60 animate-pulse" />
        <div
          className="absolute top-0 -left-[10%] w-[50%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full -rotate-12 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-0 -right-[10%] w-[50%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full rotate-12 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <Meteors className="z-10 opacity-5 dark:opacity-15" />

      {/* Standalone Header Section */}
      <header className="relative w-full z-20 border-b border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-slate-900 dark:text-white tracking-[-1px] text-lg flex items-center gap-2"
            >
              <Image
                src="/main-logo.png"
                width={100}
                height={100}
                className="w-9 lg:w-[30px] transition-transform duration-700 dark:hidden"
                alt="NeuralPress"
              />
              <Image
                src="/main-logo-white.png"
                width={100}
                height={100}
                className="w-9 lg:w-[30px] transition-transform duration-700 hidden dark:block"
                alt="NeuralPress"
              />
              NeuralPress
            </Link>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-xs font-inter font-light text-slate-500 dark:text-slate-400 hidden sm:inline">
              AI News Discovery Portal
            </span>
            <LangToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto z-10 relative pt-10 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Standalone Footer */}
      <footer className="relative w-full z-20 mt-20 py-8 border-t border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-black/40 backdrop-blur-xl text-center text-xs text-slate-500 dark:text-slate-400 font-inter font-light transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-4">
          <p>© {new Date().getFullYear()} NeuralPress. All rights reserved.</p>
        </div>
      </footer>
      {/* <FloatingBusiness /> */}
    </div>
  );
}
