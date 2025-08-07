
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";

export default function IndustryBenchmarks({ values, onChange, onReset, language, isPrinting }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isRTL = language === 'he';

  const benchmarks = [
    {
      label: language === 'he' ? 'זמן טיפול ממוצע (דקות)' : 'Average ticket handle time (minutes)',
      field: "avg_ticket_handle_time_min",
      tooltip: language === 'he' ? 'זמן ממוצע שטכנאי מקדיש לטיפול אקטיבי בקריאה.' : 'Average time a technician spends actively working on a ticket.'
    },
    {
      label: language === 'he' ? 'זמן ממוצע לפתרון (שעות)' : 'Mean time to resolve (hours)',
      field: "mean_time_to_resolve_hours",
      tooltip: language === 'he' ? 'הזמן הכולל מיצירת הקריאה ועד לפתרונה, כולל זמני המתנה.' : 'Total time from ticket creation to resolution, including waiting times.'
    },
    {
      label: language === 'he' ? 'אחוז קריאות שנפתרו אוטונומית' : '% of tickets autonomously resolved',
      field: "autonomous_resolution_rate",
      isPct: true,
      tooltip: language === 'he' ? 'אחוז הקריאות שנפתרו אוטומטית על ידי AI/אוטומציה ללא התערבות אנושית.' : '% of tickets resolved automatically by AI/automation without human intervention.'
    },
    {
      label: language === 'he' ? 'אחוז זמן טכנאי שנחסך בקריאות' : '% tech time saved on remaining tickets',
      field: "assisted_time_saved_pct",
      isPct: true,
      tooltip: language === 'he' ? 'אחוז מזמן הטכנאי שנחסך בקריאות שבהן סיוע AI/אוטומציה.' : '% of technician time saved on tickets where AI/automation assisted.'
    },
    {
      label: language === 'he' ? 'אחוז הפחתה בזמן אבוד עובדים' : '% reduction in employee lost time',
      field: "employee_lost_time_reduction_pct",
      isPct: true,
      tooltip: language === 'he' ? 'אחוז ההפחתה בזמן שעובדים מבלים בהתמודדות עם בעיות IT.' : '% reduction in time employees spend dealing with IT issues.'
    },
    {
      label: language === 'he' ? 'אחוז הפחתה בתחלופת טכנאים' : '% reduction in technician turnover',
      field: "reduction_in_tech_turnover_pct",
      isPct: true,
      tooltip: language === 'he' ? 'אחוז ההפחתה בשיעור שבו טכנאים עוזבים את החברה.' : '% reduction in the rate at which technicians leave the company.'
    },
    {
      label: language === 'he' ? 'שיעור תחלופה שנתי בתמיכה' : 'Annual help-desk turnover rate',
      field: "annual_tech_turnover_rate",
      isPct: true,
      tooltip: language === 'he' ? 'האחוז השנתי של טכנאים שעוזבים את החברה.' : 'Annual percentage of technicians leaving the company.'
    },
    {
      label: language === 'he' ? 'אחוז משכר להעסקה/החלפת טכנאי' : '% of salary to hire/replace tech',
      field: "cost_to_replace_tech_pct",
      isPct: true,
      tooltip: language === 'he' ? 'אחוז מהשכר השנתי הנדרש לגייס ולהכשיר טכנאי חדש.' : 'Percentage of annual salary required to recruit and train a new technician.'
    },
    {
      label: language === 'he' ? 'משך שיא יומי (שעות)' : 'Daily creation-peak duration (hours)',
      field: "daily_peak_duration_hours",
      tooltip: language === 'he' ? 'מספר השעות ביום שבהן יצירת הקריאות נמצאת בשיאה.' : 'Number of hours during the day when ticket creation is at its highest.'
    },
    {
      label: language === 'he' ? 'טכנאים נוספים לשעות לא עבודה' : 'Extra techs for non-working hours',
      field: "extra_techs_nonworking",
      defaultValue: 1,
      tooltip: language === 'he' ? 'מספר הטכנאים הנוספים הנדרשים לכיסוי שעות עבודה לא סטנדרטיות או משמרות.' : 'Number of additional technicians needed to cover non-standard working hours or shifts.'
    },
    {
      label: language === 'he' ? 'אחוז שעות עבודה על קריאות (טיפוסי)' : '% working hrs on tickets (typical)',
      field: "occupancy_pct_typical",
      isPct: true,
      tooltip: language === 'he' ? 'אחוז טיפוסי משעות העבודה של טכנאי המוקדשות ישירות לטיפול בקריאות.' : 'Typical percentage of a technician\'s working hours spent directly on tickets.'
    },
    {
      label: language === 'he' ? 'אחוז שעות עבודה על קריאות (אופטימלי)' : '% working hrs on tickets (optimal)',
      field: "occupancy_pct_optimal",
      isPct: true,
      tooltip: language === 'he' ? 'אחוז אופטימלי משעות העבודה של טכנאי שאמור להיות מוקדש ישירות לטיפול בקריאות ליעילות מקסימלית.' : 'Optimal percentage of a technician\'s working hours that should be spent directly on tickets for maximum efficiency.'
    },
    {
      label: language === 'he' ? 'ימי עבודה של עובדים בשנה' : 'Employee working days per year',
      field: "working_days_year",
      tooltip: language === 'he' ? 'מספר ימי העבודה לעובד ממוצע בשנה.' : 'Number of working days for an average employee in a year.'
    },
    {
      label: language === 'he' ? 'זמן עובד שאבד (דקות/יום)' : 'Lost employee time on unreported issues (min/day)',
      field: "lost_emp_time_min_day",
      tooltip: language === 'he' ? 'ממוצע דקות ביום שעובד מאבד עקב בעיות IT שלא טופלו או טופלו לאט.' : 'Average minutes per day an employee loses due to unaddressed or slow-to-resolve IT issues.'
    },
  ];

  return (
    <Card className="bg-white border border-[#0c3133]/20 shadow-lg">
      <CardHeader className="border-b border-[#0c3133]/10 bg-gradient-to-r from-[#0c3133]/5 to-[#f9f9f9]">
        <div className={`flex ${isRTL ? 'flex-row-reverse' : ''} justify-between items-center`}>
          <CardTitle className={`flex items-center gap-3 text-[#0c3133] ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-7 h-7 bg-gradient-to-r from-[#0c3133] to-gray-700 rounded-lg flex items-center justify-center shadow-lg">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <span className={isRTL ? 'text-right' : ''}>{language === 'he' ? 'ברירות מחדל מדדי תעשייה' : 'Industry Benchmark Defaults'}</span>
          </CardTitle>
          <div className={`flex items-center gap-2 no-print ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-[#f52e6e] hover:text-[#f52e6e]/80 hover:bg-[#f52e6e]/10"
            >
              {language === 'he' ? 'איפוס לברירת מחדל' : 'Reset to Defaults'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#0c3133] hover:text-[#0c3133]/80 hover:bg-[#0c3133]/10"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      {(isExpanded || isPrinting) && (
        <CardContent className="p-6 bg-[#f9f9f9]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {benchmarks.map(({ label, field, isPct, tooltip }) => (
              <div key={field} className="space-y-1">
                <Label
                  htmlFor={field}
                  className={`text-sm text-[#0c3133]/80 ${isRTL ? 'text-right' : ''}`}
                  title={tooltip} // Added tooltip as title attribute
                >
                  {label}
                </Label>
                <div className="relative">
                  <Input
                    id={field}
                    type="number"
                    step="0.01"
                    value={isPct ? (values[field] * 100) : values[field]}
                    onChange={(e) => onChange(field, isPct ? (parseFloat(e.target.value) / 100) || 0 : parseFloat(e.target.value) || 0)}
                    className={`border border-[#0c3133]/20 focus:border-[#f52e6e] focus:ring-[#f52e6e]/30 pr-8 ${isRTL ? 'text-right' : ''}`}
                    dir={isRTL ? 'rtl' : 'ltr'}
                  />
                  {isPct && (
                    <span className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center text-sm text-[#0c3133]/60 pointer-events-none`}>
                      %
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
