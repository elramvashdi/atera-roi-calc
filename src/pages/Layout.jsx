

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Calculator, BarChart3, Settings, FileText } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header */}
      <header className="bg-white border-b-2 border-[#f52e6e]/20 shadow-lg sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link to={createPageUrl("Calculator")} className="flex items-center gap-4">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/fca70b82e_Logo_260x641.png" alt="Atera Logo" className="h-10" />
              </Link>
              <div className="border-l border-gray-200 pl-4 hidden sm:block">
                 <h1 className="text-lg font-bold text-[#0c3133]">ROI Calculator</h1>
                 <p className="text-sm text-gray-500 -mt-1">for Autopilot</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to={createPageUrl("Calculator")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 min-w-[120px] text-center ${
                  location.pathname === createPageUrl("Calculator")
                    ? "bg-[#f52e6e]/10 text-[#f52e6e] shadow-sm border-2 border-[#f52e6e]/30"
                    : "text-[#0c3133] hover:text-[#f52e6e] hover:bg-[#f52e6e]/5 border-2 border-transparent"
                }`}
              >
                <Calculator className="w-4 h-4 inline mr-2" />
                Calculator
              </Link>
              <Link
                to={createPageUrl("Reports")}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 min-w-[120px] text-center ${
                  location.pathname === createPageUrl("Reports")
                    ? "bg-[#0c3133]/10 text-[#0c3133] shadow-sm border-2 border-[#0c3133]/30"
                    : "text-[#0c3133] hover:text-[#f52e6e] hover:bg-[#f52e6e]/5 border-2 border-transparent"
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Saved Calculations
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-2 border-[#f52e6e]/20 mt-16 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-r from-[#f52e6e] to-[#0c3133] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">A</span>
              </div>
              <span className="text-[#0c3133] font-semibold">Powered by Atera</span>
            </div>
            <p className="text-[#0c3133]/70 text-sm">
              ROI calculations based on industry benchmarks and peer-reviewed studies
            </p>
            <p className="text-[#0c3133]/50 text-xs mt-2">
              Data sources: Gartner, HDI, ITSM.tools, and ServiceNow industry reports
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

