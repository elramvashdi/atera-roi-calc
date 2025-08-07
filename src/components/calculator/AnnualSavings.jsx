
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TrendingUp, DollarSign, Clock, Users, Shield, Zap, Award, Target, Info, Calculator, Settings, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function AnnualSavings({ calculations, language, translations, tooltips, inputs, onInputChange }) {
  const [expandedParams, setExpandedParams] = useState({});
  const [enabledSavings, setEnabledSavings] = useState({
    techHours: true,
    techTurnover: true,
    employeeHours: true,
    value247: true
  });

  const formatCurrency = (val) => {
    const currencySymbol = language === 'he' ? '₪' : '$';
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: language === 'he' ? 'ILS' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).replace(/[₪$]/g, currencySymbol);
  };

  const formatNumber = (val) => val.toLocaleString(undefined, { maximumFractionDigits: 0 });

  const isRTL = language === 'he';

  const toggleParams = (key) => {
    setExpandedParams(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSaving = (key) => {
    setEnabledSavings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleParameterChange = (field, value, isPercentage = false) => {
    const actualValue = isPercentage ? value / 100 : value;
    onInputChange(field, actualValue);
  };

  // Direct savings (IT Operations)
  const directSavings = [
    {
      key: 'techHours',
      title: translations.techHoursSaved,
      value: calculations.savings_tech_hours,
      hours: calculations.tech_hours_saved_year,
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      tooltip: tooltips.techHoursSaved,
      formula: `Tech Hours Saved/Year × Tech Loaded Wage/Hour\n= ${formatNumber(calculations.tech_hours_saved_year || 0)} × ${formatCurrency(calculations.tech_loaded_wage_per_hour || 0)}\n= ${formatCurrency(calculations.savings_tech_hours || 0)}`,
      parameters: [
        { 
          label: language === 'he' ? 'אחוז כרטיסים שנפתרו אוטונומית' : 'Autonomous resolution rate (%)', 
          field: 'autonomous_resolution_rate', 
          value: inputs.autonomous_resolution_rate * 100,
          step: 1,
          min: 0,
          max: 50 
        },
        { 
          label: language === 'he' ? 'אחוז זמן שנחסך בכרטיסים' : 'Time saved on assisted tickets (%)', 
          field: 'assisted_time_saved_pct', 
          value: inputs.assisted_time_saved_pct * 100,
          step: 1,
          min: 0,
          max: 80 
        }
      ]
    },
    {
      key: 'techTurnover',
      title: translations.techTurnoverSaved,
      value: calculations.savings_tech_turnover,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      tooltip: tooltips.techTurnoverSaved,
      formula: `Savings from FTE reduction + Reduced turnover on remaining staff\n= (${(calculations.tech_fte_saved || 0).toFixed(2)} FTE × ${(inputs.annual_tech_turnover_rate * 100).toFixed(0)}% × ${formatCurrency(calculations.cost_to_replace_tech || 0)}) + \n  (${inputs.techs} remaining × ${(inputs.reduction_in_tech_turnover_pct * 100).toFixed(0)}% × ${(inputs.annual_tech_turnover_rate * 100).toFixed(0)}% × ${formatCurrency(calculations.cost_to_replace_tech || 0)})\n= ${formatCurrency(calculations.savings_tech_turnover || 0)}`,
      parameters: [
        { 
          label: language === 'he' ? 'אחוז הפחתה בתחלופת טכנאים' : 'Reduction in tech turnover (%)', 
          field: 'reduction_in_tech_turnover_pct', 
          value: inputs.reduction_in_tech_turnover_pct * 100,
          step: 1,
          min: 0,
          max: 30 
        },
        { 
          label: language === 'he' ? 'עלות החלפת טכנאי (% משכר)' : 'Cost to replace tech (% of salary)', 
          field: 'cost_to_replace_tech_pct', 
          value: inputs.cost_to_replace_tech_pct * 100,
          step: 1,
          min: 10,
          max: 100 
        }
      ]
    }
  ];

  // Indirect value (Company-wide)
  const indirectSavings = [
    {
      key: 'employeeHours',
      title: translations.employeeHoursSaved,
      value: calculations.savings_emp_hours,
      hours: calculations.total_annual_emp_hours_saved,
      icon: Users,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      tooltip: tooltips.employeeHoursSaved,
      formula: `Employee Hours Saved/Year × Employee Loaded Wage/Hour\n= ${formatNumber(calculations.total_annual_emp_hours_saved || 0)} × ${formatCurrency(calculations.emp_loaded_wage_per_hour || 0)}\n= ${formatCurrency(calculations.savings_emp_hours || 0)}`,
      parameters: [
        { 
          label: language === 'he' ? 'זמן אבוד לעובד ביום (דקות)' : 'Lost employee time per day (minutes)', 
          field: 'lost_emp_time_min_day', 
          value: inputs.lost_emp_time_min_day,
          step: 1,
          min: 5,
          max: 60 
        },
        { 
          label: language === 'he' ? 'הפחתה בזמן אבוד עובדים (%)' : 'Employee lost time reduction (%)', 
          field: 'employee_lost_time_reduction_pct', 
          value: inputs.employee_lost_time_reduction_pct * 100,
          step: 1,
          min: 0,
          max: 60 
        }
      ]
    },
    {
      key: 'value247',
      title: translations.value247Response,
      value: calculations.value_24_7_response,
      icon: Zap,
      color: "from-[#f52e6e] to-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      tooltip: tooltips.value247Response,
      formula: `Peak hours value + Non-working hours value\n= (${inputs.daily_peak_duration_hours}h × ${inputs.working_days_year} days × ${(calculations.extra_techs_peak || 0).toFixed(2)} techs × ${formatCurrency(calculations.tech_loaded_wage_per_hour || 0)}) + \n  (${inputs.extra_techs_nonworking} techs × ${formatCurrency(calculations.tech_loaded_wage_per_hour || 0)} × 170h × 12 months)\n= ${formatCurrency(calculations.value_24_7_response || 0)}`,
      parameters: [
        { 
          label: language === 'he' ? 'משך שיא יומי (שעות)' : 'Daily peak duration (hours)', 
          field: 'daily_peak_duration_hours', 
          value: inputs.daily_peak_duration_hours,
          step: 0.5,
          min: 1,
          max: 8 
        },
        { 
          label: language === 'he' ? 'טכסאים נוספים לשעות לא עבודה' : 'Extra techs for non-working hours', 
          field: 'extra_techs_nonworking', 
          value: inputs.extra_techs_nonworking,
          step: 1,
          min: 0,
          max: 5 
        }
      ]
    }
  ];

  const renderSavingsSection = (title, savingsArray) => {
    // Calculate totals for enabled savings only
    const enabledSavingsInSection = savingsArray.filter(item => enabledSavings[item.key]);
    const enabledTotal = enabledSavingsInSection.reduce((sum, item) => sum + (item.value || 0), 0);
    const enabledTotalHours = enabledSavingsInSection.reduce((sum, item) => sum + (item.hours || 0), 0);

    return (
      <Card className="bg-white border-2 border-[#f52e6e]/20 shadow-2xl card-print-override print-section mb-8">
        <CardHeader className="border-b border-[#f52e6e]/10 bg-gradient-to-r from-[#f52e6e]/5 via-white to-[#0c3133]/5 relative">
          <CardTitle className={`flex items-center justify-between text-[#0c3133] relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-9 h-9 bg-gradient-to-r from-[#f52e6e] to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">{title}</span>
                {enabledTotalHours > 0 && (
                  <p className="text-lg text-[#0c3133]/70 font-semibold mt-1">
                    {language === 'he' ? `${formatNumber(enabledTotalHours)} שעות נחסכו בשנה` : `${formatNumber(enabledTotalHours)} hours saved annually`}
                  </p>
                )}
              </div>
            </div>
            <div className={`text-2xl font-bold text-[#f52e6e] ${isRTL ? 'text-left' : 'text-right'}`}>
              {formatCurrency(enabledTotal)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-gradient-to-br from-white to-[#f9f9f9]">
          <TooltipProvider>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savingsArray.map(({ key, title, value, hours, icon: Icon, color, bgColor, borderColor, tooltip, formula, parameters }) => {
                const isEnabled = enabledSavings[key];
                
                return (
                  <div key={key} className={`savings-item relative rounded-xl border-2 p-6 transition-all duration-300 ${
                    isEnabled 
                      ? `${borderColor} ${bgColor} hover:shadow-lg` 
                      : 'border-gray-300 bg-gray-100 hover:shadow-md hover:border-gray-400'
                  }`}>
                    <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} no-print`}>
                      <Switch
                        id={`toggle-${key}`}
                        checked={isEnabled}
                        onCheckedChange={() => toggleSaving(key)}
                        className={`transition-all duration-200 ${
                          isEnabled 
                            ? "data-[state=checked]:bg-[#f52e6e]" 
                            : "data-[state=unchecked]:bg-gray-400 hover:data-[state=unchecked]:bg-gray-500"
                        }`}
                      />
                    </div>
                    <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''} transition-opacity duration-200 ${!isEnabled ? 'opacity-50' : ''}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-200 ${
                        isEnabled 
                          ? `bg-gradient-to-r ${color}` 
                          : 'bg-gradient-to-r from-gray-400 to-gray-500'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 pr-8">
                        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className={`text-sm font-medium mb-1 ${isRTL ? 'text-right' : ''} transition-colors duration-200 ${
                            isEnabled ? 'text-[#0c3133]/80' : 'text-gray-500'
                          }`}>{title.replace(/[₪$]/g, '')}</div>
                          {!isEnabled && (
                            <span className="text-xs text-gray-400 italic">
                              {language === 'he' ? '(לחץ להחזרה)' : '(click to restore)'}
                            </span>
                          )}
                          {isEnabled && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button className="focus:outline-none z-50">
                                  <Info className="w-4 h-4 text-[#0c3133]/50 hover:text-[#f52e6e] cursor-pointer" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="top" 
                                className="max-w-sm p-4 bg-white border-2 border-[#f52e6e]/20 shadow-xl z-[9999] print:hidden"
                                sideOffset={15}
                                avoidCollisions={true}
                                collisionPadding={20}
                              >
                                <div className="space-y-3">
                                  <p className="text-sm text-gray-700">{tooltip}</p>
                                  <div className="border-t pt-3">
                                    <p className="text-xs text-gray-500 mb-2 font-semibold">Calculation:</p>
                                    <div className="font-mono text-xs leading-relaxed text-gray-700 whitespace-pre-line">
                                      {formula}
                                    </div>
                                  </div>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <div className={`flex items-baseline gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <div className={`text-2xl font-bold ${isRTL ? 'text-right' : ''} transition-colors duration-200 ${
                            isEnabled ? 'text-[#0c3133]' : 'text-gray-400 line-through'
                          }`}>
                            {formatCurrency(isEnabled ? (value || 0) : 0)}
                          </div>
                          {!isEnabled && (
                            <div className="text-sm text-gray-400 italic">
                              {language === 'he' ? 'מבוטל' : 'Excluded'}
                            </div>
                          )}
                        </div>
                        {hours && (
                          <div className={`text-base font-medium mt-1 ${isRTL ? 'text-right' : ''} transition-colors duration-200 ${
                            isEnabled ? 'text-[#0c3133]/70' : 'text-gray-400'
                          }`}>
                            {language === 'he' ? `${formatNumber(isEnabled ? hours : 0)} שעות בשנה` : `${formatNumber(isEnabled ? hours : 0)} hours/year`}
                          </div>
                        )}
                        
                        {/* Parameters Section - Only show when enabled */}
                        {isEnabled && (
                          <div className="mt-4 no-print">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleParams(key)}
                              className="flex items-center gap-2 text-xs"
                            >
                              <Settings className="w-3 h-3" />
                              {language === 'he' ? 'פרמטרים מרכזיים' : 'Key Parameters'}
                              {expandedParams[key] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </Button>
                            
                            {expandedParams[key] && (
                              <div className="mt-3 space-y-3 p-3 bg-white/50 rounded-lg border border-gray-200">
                                {parameters.map((param) => (
                                  <div key={param.field} className="space-y-1">
                                    <Label className="text-xs text-gray-600">{param.label}</Label>
                                    <Input
                                      type="number"
                                      step={param.step}
                                      min={param.min}
                                      max={param.max}
                                      value={param.value}
                                      onChange={(e) => handleParameterChange(param.field, parseFloat(e.target.value) || 0, param.field.includes('_pct') || param.field.includes('_rate'))}
                                      className="h-8 text-sm"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    );
  };

  const directTotal = directSavings.filter(item => enabledSavings[item.key]).reduce((sum, item) => sum + (item.value || 0), 0);
  const indirectTotal = indirectSavings.filter(item => enabledSavings[item.key]).reduce((sum, item) => sum + (item.value || 0), 0);
  const directTotalHours = directSavings.filter(item => enabledSavings[item.key]).reduce((sum, item) => sum + (item.hours || 0), 0);
  const indirectTotalHours = indirectSavings.filter(item => enabledSavings[item.key]).reduce((sum, item) => sum + (item.hours || 0), 0);
  
  // Calculate direct and indirect ROI based on enabled savings only
  const totalCost = calculations.total_cost || 0;
  const directROI = totalCost > 0 ? (directTotal / totalCost) * 100 : 0;
  const indirectROI = totalCost > 0 ? (indirectTotal / totalCost) * 100 : 0;
  const totalROI = totalCost > 0 ? ((directTotal + indirectTotal) / totalCost) * 100 : 0;

  return (
    <div className="space-y-8">
      {renderSavingsSection(
        language === 'he' ? 'חיסכון ישיר (מבצעי IT)' : 'Direct Savings (IT Operations)', 
        directSavings
      )}
      
      {renderSavingsSection(
        language === 'he' ? 'ערך עקיף (כלל החברה)' : 'Indirect Value (Company-wide)', 
        indirectSavings
      )}

      {/* Updated ROI Summary */}
      <Card className="bg-white border-2 border-[#0c3133]/20 shadow-2xl card-print-override print-section">
        <CardHeader className="border-b border-[#0c3133]/10 bg-gradient-to-r from-[#0c3133]/5 via-white to-[#f52e6e]/5 relative">
          <CardTitle className={`flex items-center gap-4 text-[#0c3133] relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-12 h-12 bg-gradient-to-r from-[#0c3133] to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6749582d8_LogoGeneral_110x110_P.png" alt="Atera" className="w-8 h-8" />
            </div>
            <div className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="text-xl font-bold">{language === 'he' ? 'סיכום החזר השקעה' : 'ROI Summary'}</span>
              <p className="text-sm text-[#0c3133]/70 font-normal mt-1">{language === 'he' ? 'סקירה מלאה של החזר ההשקעה שלך' : 'Your complete return on investment overview'}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-gradient-to-br from-white to-[#f9f9f9]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
            {/* IT Savings & ROI */}
            <div className="space-y-4">
              <MetricCard
                title={language === 'he' ? 'סה״כ חיסכון (IT)' : 'Total IT Savings'}
                value={formatCurrency(directTotal)}
                color="from-blue-500 to-blue-600"
                icon={Target}
                subtitle={language === 'he' ? 'חיסכון ישיר במבצעי IT' : 'Direct IT operations savings'}
                isRTL={isRTL}
              />
              <MetricCard
                title={language === 'he' ? 'החזר השקעה (IT)' : 'IT ROI'}
                value={`${directROI.toFixed(0)}%`}
                color="from-purple-500 to-purple-600"
                icon={Award}
                subtitle={language === 'he' ? 'החזר השקעה ישיר' : 'Direct ROI percentage'}
                isRTL={isRTL}
              />
            </div>

            {/* Total Savings & ROI */}
            <div className="space-y-4">
              <MetricCard
                title={language === 'he' ? 'סה"כ חיסכון שנתי' : 'Total Annual Savings'}
                value={formatCurrency(directTotal + indirectTotal)}
                color="from-green-500 to-green-600"
                icon={Target}
                subtitle={language === 'he' ? 'חיסכון ישיר + ערך עקיף' : 'Direct Savings + Indirect Value'}
                isRTL={isRTL}
              />
              <MetricCard
                title={language === 'he' ? 'סה"כ החזר השקעה' : 'Total ROI'}
                value={`${totalROI.toFixed(0)}%`}
                color="from-[#f52e6e] to-pink-600"
                icon={Award}
                subtitle={language === 'he' ? 'החזר השקעה מצטבר' : 'Combined return on investment'}
                isRTL={isRTL}
              />
            </div>

            {/* Cost Column - Right Side, Centered */}
            <div className="flex items-center justify-center">
               <MetricCard
                  title={translations.totalCost}
                  value={formatCurrency(totalCost)}
                  color="from-[#0c3133] to-gray-700"
                  icon={DollarSign}
                  subtitle={language === 'he' ? 'השקעה נדרשת' : 'Investment required'}
                  isRTL={isRTL}
                />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const MetricCard = ({ title, value, color, icon: Icon, subtitle, isRTL }) => {
  return (
    <Card className={`bg-white border border-gray-200 shadow-md transition-all duration-300 relative`}>
      <CardContent className="p-6 relative z-10">
        <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-between'} mb-3`}>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-10 ${
            color.includes('blue') ? 'bg-blue-500' :
            color.includes('purple') ? 'bg-purple-500' :
            color.includes('green') ? 'bg-green-500' :
            color.includes('f52e6e') ? 'bg-[#f52e6e]' :
            'bg-gray-500'
          }`}>
            <Icon className={`w-5 h-5 ${
              color.includes('blue') ? 'text-blue-600' :
              color.includes('purple') ? 'text-purple-600' :
              color.includes('green') ? 'text-green-600' :
              color.includes('f52e6e') ? 'text-[#f52e6e]' :
              'text-gray-600'
            }`} />
          </div>
        </div>
        <div className={`text-sm font-medium text-gray-600 mb-1 ${isRTL ? 'text-right' : ''}`}>{title}</div>
        <div className={`text-2xl font-bold mb-1 text-gray-900 ${isRTL ? 'text-right' : ''}`}>{value}</div>
        <div className={`text-xs text-gray-500 ${isRTL ? 'text-right' : ''}`}>{subtitle}</div>
      </CardContent>
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/30 to-transparent pointer-events-none"></div>
    </Card>
  );
};
