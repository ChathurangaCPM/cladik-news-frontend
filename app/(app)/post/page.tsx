"use client";

import { useRef, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toPng } from "html-to-image";
import { getNewsById, uploadImageToR2 } from "../actions/news";

interface NewsItem {
  id: string;
  title: string;
  sinhalaTitle?: string;
  summary?: string;
  sinhalaSummary?: string;
  dynamicOgImage?: string;
}

function PostImageCreator() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  
  const elementRef = useRef<HTMLDivElement>(null);

  // Fetch news data if id parameter is provided
  useEffect(() => {
    if (!id) return;
    
    async function fetchNews(newsId: string) {
      try {
        setLoading(true);
        setStatus("Fetching news details...");
        const data = await getNewsById(newsId);
        setNews(data);
        setStatus(null);
      } catch (err: any) {
        console.error(err);
        setStatus(`Error fetching news: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchNews(id);
  }, [id]);

  const handleDownload = async () => {
    if (!elementRef.current) return;

    try {
      setStatus("Generating image...");
      const dataUrl = await toPng(elementRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // Force consistent crisp 2x resolution
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `news-card-${id || "captured"}.png`;
      link.click();
      setStatus("Image downloaded successfully!");
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error("Error generating image:", error);
      setStatus("Error generating image.");
    }
  };

  const handleSaveToCloud = async () => {
    if (!elementRef.current || !id) {
      setStatus("Cannot save: No news ID found.");
      return;
    }

    try {
      setLoading(true);
      setStatus("Generating image...");
      
      // Convert current DOM state to base64 PNG URL with a crisp and safe pixel ratio
      const dataUrl = await toPng(elementRef.current, { 
        cacheBust: true,
        pixelRatio: 2, // Always render at exactly 2x resolution to avoid giant payloads on high-DPI screens
      });
      
      setStatus("Uploading to Cloudflare R2...");
      const { url } = await uploadImageToR2(`${id}.png`, dataUrl);
      
      // Update local state preview without updating the database
      setNews(prev => prev ? { ...prev, dynamicOgImage: url } : null);
      
      setStatus("Successfully uploaded to R2 cloud!");
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      console.error(err);
      setStatus(`Error saving to cloud: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Define default values
  const displayTitle = news?.sinhalaTitle || 
    "ලෝක කුසලානයට පෙර ඕලන්ද කණ්ඩායමේ සූදානම: උස්බෙකිස්තානය සමඟ පුහුණු තරගයට රොනල්ඩ් කූමන් සූදානම්.";
  
  const displaySummary = news?.sinhalaSummary || 
    "ඕලන්ද කණ්ඩායමේ කළමනාකරු රොනල්ඩ් කූමන්, ජපානය සමඟ පැවැත්වෙන ලෝක කුසලාන ආරම්භක තරගයට පෙර සිය ප්‍රධාන කණ්ඩායම සූදානම් කර ගැනීම සඳහා උස්බෙකිස්තානය සමඟ පැවැත්වෙන සුහද පාපන්දු තරගය යොදා ගැනීමට තීරණය කර ඇත.";

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      {status && (
        <div className={`mb-4 p-3 rounded text-sm ${status.includes("Error") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
          {status}
        </div>
      )}

      {/* Target element to capture */}
      <div
        id="news-card"
        ref={elementRef}
        className="py-[60px] px-[60px] relative w-[650px] bg-gradient-to-b from-[#2b86ff] via-[#489cff] to-[#fafbfe] pt-6 pb-28 overflow-hidden flex flex-col items-center justify-between gap-4 shadow-xl rounded-lg"
      >
        <img
          src="/main-logo-white.png"
          alt="News Hero Light"
          className="w-[80px] mt-10 mx-auto relative z-10 block"
        />

        <div className="font-light relative items-center justify-center text-center z-10 mb-8">
          <h3 className="text-white text-2xl">NeuralPress</h3>
          <p className="text-white">The AI-powered news aggregator</p>
        </div>

        <div className="p-[40px] flex flex-col gap-8 bg-white/20 rounded-[50px] px-8 backdrop-blur-2xl z-10">
          <h1 className="text-3xl text-white font-bold text-center font-sinhala leading-normal">
            {displayTitle}
          </h1>
          <p className="text-center font-sinhala text-white/90 leading-relaxed">
            {displaySummary}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleDownload}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:bg-gray-400 transition"
        >
          Download as PNG
        </button>
        
        {id && (
          <button
            onClick={handleSaveToCloud}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {news?.dynamicOgImage ? "Update Image on R2" : "Save Image to R2"}
          </button>
        )}
      </div>

      {news?.dynamicOgImage && (
        <div className="mt-8 border-t pt-6">
          <h4 className="text-sm font-semibold mb-2">Current Saved Image (R2):</h4>
          <a href={news.dynamicOgImage} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all text-xs block mb-4">
            {news.dynamicOgImage}
          </a>
          <img src={news.dynamicOgImage} alt="Saved Card" className="w-[300px] border rounded shadow-md" />
        </div>
      )}
    </div>
  );
}

export default function ExportImageComponent() {
  return (
    <Suspense fallback={<div className="p-6">Loading news editor...</div>}>
      <PostImageCreator />
    </Suspense>
  );
}
