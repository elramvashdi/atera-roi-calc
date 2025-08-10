
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, Download, RefreshCw, Globe, FileText, File } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CoreInputs from "../components/calculator/CoreInputs";
import IndustryBenchmarks from "../components/calculator/IndustryBenchmarks";
import IntermediateCalculations from "../components/calculator/IntermediateCalculations";
import AnnualSavings from "../components/calculator/AnnualSavings";
import { supabase } from '../api/client';

const defaultInputs = {
  // Core user inputs
  company_name: "",
  employees: 1000,
  techs: 15,
  total_tickets_month_input: 1600,
  annual_tech_wage: 78462,
  annual_emp_wage: 72097,
  autopilot_fee_month: 25,
  
  // Industry / benchmark defaults
  tickets_per_user_month: 1.6,
  avg_ticket_handle_time_min: 72,
  mean_time_to_resolve_hours: 9.72,
  autonomous_resolution_rate: 0.15,
  assisted_time_saved_pct: 0.30,
  employee_lost_time_reduction_pct: 0.30,
  reduction_in_tech_turnover_pct: 0.10,
  annual_tech_turnover_rate: 0.42,
  cost_to_replace_tech_pct: 0.30,
  daily_peak_duration_hours: 1, // Updated from 2 to 1
  occupancy_pct_typical: 0.75,
  occupancy_pct_optimal: 0.40,
  working_days_year: 230,
  lost_emp_time_min_day: 22,
  extra_techs_nonworking: 1,
};

const translations = {
  en: {
    title: "Atera Autopilot ROI Calculator",
    subtitle: "Calculate the return on investment for AI-powered IT ticket automation and discover your potential savings.",
    exportResults: "Export Results",
    saveCalculation: "Save Calculation",
    exportFullReport: "Export Full Report",
    exportSummary: "Export Summary",
    currency: "USD",
    currencySymbol: "$",
    language: "English",
    // Input labels
    companyName: "Company Name",
    employees: "Number of Employees Supported",
    techs: "Current Help-desk Technicians (FTE)",
    totalTickets: "Total Tickets per Month",
    techWage: "Annual Technician Wage",
    empWage: "Annual Employee Wage",
    autopilotFee: "Monthly Autopilot Subscription per Employee",
    // Savings labels
    techHoursSaved: "$ Savings on tech hours saved",
    employeeHoursSaved: "$ Value of employees hours saved",
    techTurnoverSaved: "$ Savings on technicians turnover",
    value247Response: "$ Value of 24/7 immediate response",
    // ROI labels
    totalSavings: "Total Annual Savings",
    totalCost: "Total Annual Cost",
    roi: "Return on Investment",
    paybackPeriod: "Payback Period",
    months: "months",
  },
  he: {
    title: "מחשבון החזר השקעה Atera Autopilot",
    subtitle: "חישוב החזר ההשקעה לאוטומציה של קריאות IT מבוססות AI וגלה את החיסכון הפוטנציאלי שלך.",
    exportResults: "יצוא תוצאות",
    saveCalculation: "שמור חישוב",
    exportFullReport: "יצוא דוח מלא",
    exportSummary: "יצוא סיכום",
    currency: "NIS",
    currencySymbol: "₪",
    language: "עברית",
    // Input labels
    companyName: "שם החברה",
    employees: "מספר העובדים הנתמכים",
    techs: "טכנאי תמיכה נוכחיים (במשרה מלאה)",
    totalTickets: "סה״כ קריאות לחודש",
    techWage: "שכר שנתי לטכנאי (₪)",
    empWage: "שכר שנתי של העובד (₪)",
    autopilotFee: "עלות מנוי חודשי ל-Autopilot לכל עובד (₪)",
    // Savings labels
    techHoursSaved: "שווי כספי של שעות טכנאיים שנחסכו",
    employeeHoursSaved: "שווי כספי של שעות עבודה של כלל העובדים שנחסכו",
    techTurnoverSaved: "שווי כספי של אי עזיבת טכנאי",
    value247Response: "שווי כספי של מענה 24/7",
    // ROI labels
    totalSavings: "סה״כ חסכון כספי",
    totalCost: "עלות שנתי",
    roi: "החזר השקעה",
    paybackPeriod: "זמן להגיע להחזר השקעה",
    months: "חודשים",
  }
};

const tooltips = {
  en: {
    techHoursSaved: "Due to part of the tickets being resolved completely by Autopilot, and the time saved on the other tickets",
    employeeHoursSaved: "Due to shorter resolution times (including off hours) and handling otherwise unreported issues",
    techTurnoverSaved: "Due to the lower number of techinicans required, plus lower turnover on the rest of the technicians",
    value247Response: "Additional techs we would have needed to hire to provide the same (meaningful) immediate response that Autopilot provides, both on peak times and non-working hours",
  },
  he: {
    techHoursSaved: "זמן שנחסך הנובע מפתרון מלא של חלק מהקריאות על ידי AutoPilot, בתוספת הזמן שנחסך בקריאות בטיפול חלקי",
    employeeHoursSaved: "זמן שנחסך הנובע מזמני פתרון קצרים יותר (כולל מחוץ לשעות העבודה) וטיפול בבעיות שלא מדווחים כלל",
    techTurnoverSaved: "חסכון עקב המספר המופחת של טכנאים הנדרשים, בתוספת תחלופה נמוכה יותר של שאר הטכנאים",
    value247Response: "חסכון של שכירות טכנאים נוספים שהיו נדרשים כדי לספק תגובה מיידית (משמעותית) שAutoPilot מספק, גם בשעות שיא וגם מחוץ לשעות העבודה",
  }
};

export default function Calculator() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [language, setLanguage] = useState('en');
  const [printView, setPrintView] = useState(null);



  const t = translations[language];
  const isRTL = language === 'he';


  useEffect(() => {
    // Check if there's a calculation to edit
    const editData = localStorage.getItem('editCalculation');
    if (editData) {
      try {
        const calcData = JSON.parse(editData);
        if (calcData.inputs) {
          setInputs(calcData.inputs);
        }
        localStorage.removeItem('editCalculation'); // Clear after loading
      } catch (error) {
        console.error('Error loading edit data:', error);
      }
    }
  }, []); 

  useEffect(() => {
    const handleAfterPrint = () => {
      setPrintView(null);
      document.body.classList.remove('printing', 'print-summary', 'print-full');
    };

    if (printView) {
      document.body.classList.add('printing', `print-${printView}`);
      // Use requestAnimationFrame to ensure styles are applied before printing
      requestAnimationFrame(() => {
        setTimeout(() => window.print(), 100);
      });
    }

    // Add event listener only once when printView becomes active
    if (printView) {
      window.addEventListener('afterprint', handleAfterPrint);
    }
    
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      // Ensure classes are removed if component unmounts or effect re-runs before printing
      document.body.classList.remove('printing', 'print-summary', 'print-full');
    };
  }, [printView]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const resetToDefaults = () => {
    setInputs(defaultInputs);
  };

  const calculateROI = () => {
    const { ...i } = inputs;
    const currencyMultiplier = language === 'he' ? 3.7 : 1; // USD to NIS conversion

    // Calculated benchmarks
    const tech_loaded_wage_per_hour = (i.annual_tech_wage * 1.3) / (170 * 12);
    const emp_loaded_wage_per_hour = (i.annual_emp_wage * 1.3) / (170 * 12);
    const cost_per_ticket_pre = tech_loaded_wage_per_hour * (i.avg_ticket_handle_time_min / 60);
    const cost_to_replace_tech = i.annual_tech_wage * i.cost_to_replace_tech_pct;
    
    const tickets_per_tech_month = (i.total_tickets_month_input) / i.techs;

    // UPDATED: Ticket creation rate at peak calculation with daily peak duration
    const work_days_per_month = 22;
    const peak_hour_share = 0.4;
    const ticket_create_rate_at_peak = (i.total_tickets_month_input * peak_hour_share) / (work_days_per_month * 60 * i.daily_peak_duration_hours);

    // Intermediate calculations
    const total_tickets_month = i.total_tickets_month_input;
    const tickets_autonomous_month = total_tickets_month * i.autonomous_resolution_rate;
    const tickets_assisted_month = total_tickets_month - tickets_autonomous_month;

    const hours_saved_autonomous = tickets_autonomous_month * (i.avg_ticket_handle_time_min / 60);
    const hours_saved_assisted = tickets_assisted_month * (i.avg_ticket_handle_time_min / 60) * i.assisted_time_saved_pct;
    
    const tech_hours_saved_month = hours_saved_autonomous + hours_saved_assisted;
    const tech_hours_saved_year = tech_hours_saved_month * 12;
    const tech_fte_saved = tech_hours_saved_year / (170 * 12 * i.occupancy_pct_typical);

    const annual_lost_hours_per_emp = (i.lost_emp_time_min_day / 60) * i.working_days_year;
    const total_annual_emp_lost_hours = annual_lost_hours_per_emp * i.employees;
    const total_annual_emp_hours_saved = total_annual_emp_lost_hours * i.employee_lost_time_reduction_pct;
    
    const annual_recruits_due_turnover = i.annual_tech_turnover_rate * i.techs;
    
    // UPDATED: Fixed matrix calculations
    const extra_techs_nonworking = i.extra_techs_nonworking; // Use input value
    const extra_techs_peak = Math.max(((ticket_create_rate_at_peak * 12) / i.occupancy_pct_optimal) - i.techs, 0);

    // Annual-savings buckets
    const savings_tech_hours = tech_hours_saved_year * tech_loaded_wage_per_hour;
    const savings_emp_hours = total_annual_emp_hours_saved * emp_loaded_wage_per_hour;
    
    const savings_from_saved_ftes = tech_fte_saved * i.annual_tech_turnover_rate * cost_to_replace_tech;
    const savings_from_reduced_rate_on_remaining_staff = (i.techs - tech_fte_saved) * i.reduction_in_tech_turnover_pct * i.annual_tech_turnover_rate * cost_to_replace_tech;
    const savings_tech_turnover = savings_from_saved_ftes + savings_from_reduced_rate_on_remaining_staff;

    const value_24_7_response = (i.daily_peak_duration_hours * i.working_days_year * extra_techs_peak * tech_loaded_wage_per_hour) +
       (extra_techs_nonworking * tech_loaded_wage_per_hour * 170 * 12);

    // ROI summary
    const total_savings = savings_tech_hours + savings_emp_hours + savings_tech_turnover + value_24_7_response;
    const total_cost = i.autopilot_fee_month * 12 * i.employees * currencyMultiplier;
    const roi = total_cost > 0 ? total_savings / total_cost : 0;
    const time_to_roi_months = roi > 0 ? 12 / roi : 0;

    return {
      tech_loaded_wage_per_hour, emp_loaded_wage_per_hour, cost_per_ticket_pre, cost_to_replace_tech,
      tickets_per_tech_month, total_tickets_month, tickets_autonomous_month, tickets_assisted_month,
      hours_saved_autonomous, hours_saved_assisted, tech_hours_saved_month, tech_hours_saved_year,
      tech_fte_saved, annual_lost_hours_per_emp, total_annual_emp_lost_hours, total_annual_emp_hours_saved,
      annual_recruits_due_turnover, extra_techs_nonworking, extra_techs_peak, ticket_create_rate_at_peak,
      savings_tech_hours, savings_emp_hours, savings_tech_turnover, value_24_7_response,
      total_savings, total_cost, roi, time_to_roi_months
    };
  };

  const calculations = calculateROI();

  const handleSave = async () => {
    if (!inputs.company_name) {
      setSaveMessage("Please enter a company name to save.");
      return;
    }
    setIsSaving(true);
  try {
    // Get the current user ID
    const { data: userData } = await supabase.auth.getUser();
    const user_id = userData?.user?.id;

    // Insert calculation into Supabase
    const { error } = await supabase
      .from('calculations')
      .insert([{
        user_id,
        company_name: inputs.company_name,
        inputs: inputs,
        results: {
          total_savings: calculations.total_savings,
          total_cost: calculations.total_cost,
          roi: calculations.roi,
          time_to_roi_months: calculations.time_to_roi_months,
        },
      }]);

    if (error) {
      setSaveMessage("Error saving calculation. Please try again.");
    } else {
      setSaveMessage("ROI calculation saved successfully!");
    }
    } catch (error) {
      setSaveMessage("Error saving calculation. Please try again.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  return (
    <>
      <style>{`
        .print-header { display: none; }
        .print-title { display: none; }
        body.printing {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @media print {
          .print-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 1rem;
            margin-bottom: 2rem;
            border-bottom: 1px solid #ddd;
          }
          .print-title {
            display: block;
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #ddd;
          }
          .no-print, .no-print * {
            display: none !important;
            visibility: hidden !important;
          }
          body * {
            visibility: hidden;
          }
          #printable-content, #printable-content * {
            visibility: visible;
          }
          #printable-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 1rem !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          body.print-summary .print-summary-hide {
            display: none !important;
          }
           body, #root, main {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .card-print-override {
              box-shadow: none !important;
              border: 1px solid #eee !important;
              break-inside: avoid;
              page-break-inside: avoid;
              margin-bottom: 2rem;
          }
          .print-section {
              break-inside: avoid;
              page-break-inside: avoid;
              page-break-after: auto;
              margin-bottom: 2rem;
          }
          .print-page-break {
              page-break-before: always;
          }
          /* Ensure grid items in ROI summary don't break */
          .grid > * {
              break-inside: avoid;
              page-break-inside: avoid;
          }
          /* Ensure savings breakdown items don't break */
          .savings-item {
              break-inside: avoid;
              page-break-inside: avoid;
              margin-bottom: 1rem;
          }
        }
      `}</style>
      <div id="printable-content" className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="print-header">
          <img src="/images/6749582d8_LogoGeneral_110x110_P.png" alt="Atera Logo" className="h-8" />
          <div className={`${isRTL ? 'text-left' : 'text-right'}`}>
            <h2 className="text-lg font-bold text-gray-800">{inputs.company_name || 'ROI Report'}</h2>
            <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="print-title">
          <div className={`inline-flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img src="/images/6749582d8_LogoGeneral_110x110_P.png" alt="Atera Logo" className="h-16 w-16" />
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-4xl font-bold text-[#0c3133]">{t.title}</h1>
            </div>
          </div>
          <p className="text-[#0c3133]/70 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="mb-8 text-center no-print">
          <div className={`inline-flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <img src="/images/6749582d8_LogoGeneral_110x110_P.png" alt="Atera Logo" className="h-16 w-16" />
            <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
              <h1 className="text-4xl font-bold text-[#0c3133]">{t.title}</h1>
            </div>
          </div>
          <p className="text-[#0c3133]/70 text-lg max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {saveMessage && (
          <Alert className="mb-6 bg-green-50 border-green-200 text-green-800 no-print">
            <AlertDescription>{saveMessage}</AlertDescription>
          </Alert>
        )}

        <div className={`flex justify-center gap-4 mb-8 no-print ${isRTL ? 'flex-row-reverse' : ''}`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 border-2 border-[#0c3133]/30 text-[#0c3133] hover:bg-[#0c3133]/10"
              >
                <Globe className="w-4 h-4" />
                Additional Currencies
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('en')}>English (USD)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('he')}>עברית (₪)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-2 border-[#0c3133]/30 text-[#0c3133] hover:bg-[#0c3133]/10">
                <Download className="w-4 h-4" /> {t.exportResults}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setPrintView('summary')}>
                <File className="w-4 h-4 mr-2" />
                {t.exportSummary}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPrintView('full')}>
                <FileText className="w-4 h-4 mr-2" />
                {t.exportFullReport}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="flex items-center gap-2 bg-[#f52e6e] hover:bg-[#f52e6e]/90 text-white font-semibold border-0 px-6 py-3 shadow-lg rounded-lg"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            {t.saveCalculation}
          </Button>
        </div>

        <div className="space-y-8">
          <div className="print-section">
            <CoreInputs values={inputs} onChange={handleInputChange} language={language} translations={t} />
          </div>
          <div className="print-summary-hide print-section">
            <IndustryBenchmarks values={inputs} onChange={handleInputChange} onReset={resetToDefaults} language={language} isPrinting={printView === 'full'} />
          </div>
          <div className="print-summary-hide print-section print-page-break">
            <IntermediateCalculations calculations={calculations} language={language} isPrinting={printView === 'full'} />
          </div>
          <div className="print-section print-page-break">
            <AnnualSavings 
              calculations={calculations} 
              language={language} 
              translations={t} 
              tooltips={tooltips[language]} 
              inputs={inputs}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}
