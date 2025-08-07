
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, ChevronDown, ChevronUp, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function IntermediateCalculations({ calculations, language, isPrinting }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (val) => {
    const currencySymbol = language === 'he' ? '₪' : '$';
    return `${currencySymbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  const formatNumber = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 1 });

  const isRTL = language === 'he';

  const metrics = [
    { 
      label: language === 'he' ? 'שכר טכנאי כולל עלות מעביד לשעה' : 'Tech loaded wage/hr', 
      value: calculations.tech_loaded_wage_per_hour, 
      format: formatCurrency,
      formula: `Annual tech wage × 1.3 (benefits) ÷ (170 hours × 12 months)\n= ${formatCurrency(calculations.annual_tech_wage || 0)} × 1.3 ÷ 2040\n= ${formatCurrency(calculations.tech_loaded_wage_per_hour || 0)}`
    },
    { 
      label: language === 'he' ? 'שכר עובד כולל עלות מעביד לשעה' : 'Employee loaded wage/hr', 
      value: calculations.emp_loaded_wage_per_hour, 
      format: formatCurrency,
      formula: `Annual employee wage × 1.3 (benefits) ÷ (170 hours × 12 months)\n= ${formatCurrency(calculations.annual_emp_wage || 0)} × 1.3 ÷ 2040\n= ${formatCurrency(calculations.emp_loaded_wage_per_hour || 0)}`
    },
    { 
      label: language === 'he' ? 'עלות לקריאה (לפני Autopilot)' : 'Cost per ticket (pre-Autopilot)', 
      value: calculations.cost_per_ticket_pre, 
      format: formatCurrency,
      formula: `Tech loaded wage/hr × (Avg ticket handle time ÷ 60)\n= ${formatCurrency(calculations.tech_loaded_wage_per_hour || 0)} × (${calculations.avg_ticket_handle_time_min || 0} ÷ 60)\n= ${formatCurrency(calculations.cost_per_ticket_pre || 0)}`
    },
    { 
      label: language === 'he' ? 'עלות החלפת טכנאי' : 'Cost to replace tech', 
      value: calculations.cost_to_replace_tech, 
      format: formatCurrency,
      formula: `Annual tech wage × Cost to replace %\n= ${formatCurrency(calculations.annual_tech_wage || 0)} × ${((calculations.cost_to_replace_tech_pct || 0) * 100).toFixed(0)}%\n= ${formatCurrency(calculations.cost_to_replace_tech || 0)}`
    },
    { 
      label: language === 'he' ? 'קריאות לטכנאי לחודש' : 'Tickets per tech/month', 
      value: calculations.tickets_per_tech_month, 
      format: formatNumber,
      formula: `Total tickets/month ÷ Number of techs\n= ${formatNumber(calculations.total_tickets_month || 0)} ÷ ${calculations.techs || 1}\n= ${formatNumber(calculations.tickets_per_tech_month || 0)}`
    },
    { 
      label: language === 'he' ? 'קצב יצירת קריאות בשיא (קריאות/דקה)' : 'Ticket creation rate at peak (tickets/min)', 
      value: calculations.ticket_create_rate_at_peak, 
      format: (v) => v.toFixed(2),
      formula: `(Total tickets/month × 40% peak share) ÷ (22 work days × 60 min × ${calculations.daily_peak_duration_hours || 1}h peak duration)\n= (${formatNumber(calculations.total_tickets_month || 0)} × 0.4) ÷ (22 × 60 × ${calculations.daily_peak_duration_hours || 1})\n= ${(calculations.ticket_create_rate_at_peak || 0).toFixed(2)}`
    },
    { 
      label: language === 'he' ? 'סה״כ קריאות לחודש' : 'Total tickets/month', 
      value: calculations.total_tickets_month, 
      format: formatNumber,
      formula: `Input value: ${formatNumber(calculations.total_tickets_month || 0)} tickets/month`
    },
    { 
      label: language === 'he' ? 'קריאות אוטונומיות לחודש' : 'Autonomous tickets/month', 
      value: calculations.tickets_autonomous_month, 
      format: formatNumber,
      formula: `Total tickets × Autonomous resolution rate\n= ${formatNumber(calculations.total_tickets_month || 0)} × ${((calculations.autonomous_resolution_rate || 0) * 100).toFixed(0)}%\n= ${formatNumber(calculations.tickets_autonomous_month || 0)}`
    },
    { 
      label: language === 'he' ? 'קריאות בסיוע לחודש' : 'Assisted tickets/month', 
      value: calculations.tickets_assisted_month, 
      format: formatNumber,
      formula: `Total tickets - Autonomous tickets\n= ${formatNumber(calculations.total_tickets_month || 0)} - ${formatNumber(calculations.tickets_autonomous_month || 0)}\n= ${formatNumber(calculations.tickets_assisted_month || 0)}`
    },
    { 
      label: language === 'he' ? 'שעות טכנאי שנחסכו לחודש' : 'Tech hours saved/month', 
      value: calculations.tech_hours_saved_month, 
      format: formatNumber,
      formula: `Hours from autonomous + Hours from assisted\n= ${formatNumber(calculations.hours_saved_autonomous || 0)} + ${formatNumber(calculations.hours_saved_assisted || 0)}\n= ${formatNumber(calculations.tech_hours_saved_month || 0)}`
    },
    { 
      label: language === 'he' ? 'שעות טכנאי שנחסכו לשנה' : 'Tech hours saved/year', 
      value: calculations.tech_hours_saved_year, 
      format: formatNumber,
      formula: `Tech hours saved/month × 12\n= ${formatNumber(calculations.tech_hours_saved_month || 0)} × 12\n= ${formatNumber(calculations.tech_hours_saved_year || 0)}`
    },
    { 
      label: language === 'he' ? 'משרות טכנאי שנחסכו' : 'Tech FTE saved', 
      value: calculations.tech_fte_saved, 
      format: (v) => v.toFixed(2),
      formula: `Tech hours saved/year ÷ (170 hours/month × 12 months × ${((calculations.occupancy_pct_typical || 0) * 100).toFixed(0)}% occupancy)\n= ${formatNumber(calculations.tech_hours_saved_year || 0)} ÷ ${(170 * 12 * (calculations.occupancy_pct_typical || 1)).toFixed(0)}\n= ${(calculations.tech_fte_saved || 0).toFixed(2)}`
    },
    { 
      label: language === 'he' ? 'סה״כ שעות עובדים שנחסכו בשנה' : 'Total annual employee hours saved', 
      value: calculations.total_annual_emp_hours_saved, 
      format: formatNumber,
      formula: `Total annual lost hours × Employee lost time reduction %\n= ${formatNumber(calculations.total_annual_emp_lost_hours || 0)} × ${((calculations.employee_lost_time_reduction_pct || 0) * 100).toFixed(0)}%\n= ${formatNumber(calculations.total_annual_emp_hours_saved || 0)}`
    },
    { 
      label: language === 'he' ? 'טכנאים נוספים לשעות שיא' : 'Extra techs for peak', 
      value: calculations.extra_techs_peak, 
      format: (v) => v.toFixed(2),
      formula: `Max(((Ticket rate at peak × 12min/ticket) ÷ ${((calculations.occupancy_pct_optimal || 0) * 100).toFixed(0)}% optimal occupancy) - Current techs, 0)\n= Max(((${(calculations.ticket_create_rate_at_peak || 0).toFixed(2)} × 12) ÷ ${((calculations.occupancy_pct_optimal || 1) * 100).toFixed(0)}%) - ${calculations.techs || 0}, 0)\n= ${(calculations.extra_techs_peak || 0).toFixed(2)}`
    },
    { 
      label: language === 'he' ? 'טכנאים נוספים לשעות לא עבודה' : 'Extra techs for non-working hours', 
      value: calculations.extra_techs_nonworking, 
      format: formatNumber,
      formula: `Input parameter: ${formatNumber(calculations.extra_techs_nonworking || 0)} techs`
    },
  ];

  return (
    <Card className="bg-white border border-[#0c3133]/20 shadow-lg">
      <CardHeader className="border-b border-[#0c3133]/10 bg-gradient-to-r from-[#0c3133]/5 to-[#f9f9f9]">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
          <CardTitle className={`flex items-center gap-3 text-[#0c3133] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <span className={isRTL ? 'text-right' : ''}>{language === 'he' ? 'חישובי רקע' : 'Intermediate Calculations'}</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[#0c3133] hover:text-[#0c3133]/80 hover:bg-[#0c3133]/10 no-print"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      {(isExpanded || isPrinting) && (
        <CardContent className="p-6 bg-[#f9f9f9]">
          <TooltipProvider>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {metrics.map(({ label, value, format, formula }) => (
                <div key={label} className="p-4 bg-white rounded-lg border border-[#0c3133]/10 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                    <div className={`text-sm text-[#0c3133]/70 ${isRTL ? 'text-right' : ''}`}>{label}</div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button className="focus:outline-none">
                          <Info className="w-3 h-3 text-[#0c3133]/50 hover:text-blue-500 cursor-pointer" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="top" 
                        className="max-w-sm p-3 bg-white border-2 border-blue-200 shadow-xl z-[9999] print:hidden"
                        sideOffset={15}
                        avoidCollisions={true}
                        collisionPadding={20}
                      >
                        <div className="font-mono text-xs leading-relaxed text-gray-700 whitespace-pre-line">
                          {formula}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className={`text-lg font-semibold text-[#0c3133] ${isRTL ? 'text-right' : ''}`}>{format(value || 0)}</div>
                </div>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      )}
    </Card>
  );
}
