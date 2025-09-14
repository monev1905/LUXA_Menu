"use client";
import React, { useEffect, useState } from "react";
import LogoLoader from "@/components/LogoLoader";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show preloader only on root URL, every time
    if (pathname === "/") {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [pathname]);

  const handleWelcome = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && <LogoLoader onWelcome={handleWelcome} />}
      <div style={{ display: loading ? "none" : "block" }}>{children}</div>
    </>
  );
} 