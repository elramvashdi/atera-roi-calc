
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Users, Headphones, DollarSign, Calendar, Target } from "lucide-react";

export default function CoreInputs({ values, onChange, language, translations }) {
  const [autopilotFeeStr, setAutopilotFeeStr] = useState(values.autopilot_fee_month.toString());

  useEffect(() => {
    // This effect syncs the local string state with the parent's number state.
    // It's important for changes like "Reset to Defaults".
    // It compares the parsed local string with the parent's number to avoid overwriting
    // user input as they type (e.g., preserving "25." without it being reverted to "25").
    if (parseFloat(autopilotFeeStr) !== values.autopilot_fee_month) {
      setAutopilotFeeStr(values.autopilot_fee_month.toString());
    }
  }, [values.autopilot_fee_month]);

  const handleAutopilotFeeChange = (e) => {
    const val = e.target.value;
    // Regex to allow numbers and a single decimal point
    if (val === "" || /^[0-9]*\.?[0-9]*$/.test(val)) {
      setAutopilotFeeStr(val);
    }
  };

  const handleAutopilotFeeBlur = () => {
    let numericValue = parseFloat(autopilotFeeStr);
    if (isNaN(numericValue)) {
      numericValue = 0;
    }
    // Update parent state for calculations
    onChange('autopilot_fee_month', numericValue);
    // Also update local state to reflect the parsed value (e.g., "25." becomes "25")
    setAutopilotFeeStr(numericValue.toString());
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const parseNumber = (value) => {
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  const handleNumberChange = (field, value) => {
    const numericValue = parseNumber(value);
    onChange(field, numericValue);
  };

  const isRTL = language === 'he';
  const currencySymbol = language === 'he' ? '₪' : '$';

  const inputs = [
    { label: translations.companyName, field: "company_name", placeholder: "Your Company Inc.", type: "text", icon: Building2 },
    { label: translations.employees, field: "employees", placeholder: "1,000", type: "number", icon: Users },
    { label: translations.techs, field: "techs", placeholder: "15", type: "number", icon: Headphones },
    { label: translations.totalTickets, field: "total_tickets_month_input", placeholder: "1,600", type: "number", icon: Target },
    { label: language === 'he' ? translations.techWage : `${translations.techWage} (${currencySymbol})`, field: "annual_tech_wage", placeholder: language === 'he' ? "144,000" : "78,462", type: "number", icon: DollarSign },
    { label: language === 'he' ? translations.empWage : `${translations.empWage} (${currencySymbol})`, field: "annual_emp_wage", placeholder: language === 'he' ? "132,000" : "72,097", type: "number", icon: DollarSign },
    { label: language === 'he' ? translations.autopilotFee : `${translations.autopilotFee} (${currencySymbol})`, field: "autopilot_fee_month", placeholder: language === 'he' ? "95.50" : "25.50", type: "number", icon: Calendar },
  ];

  return (
    <Card className="bg-white border-2 border-[#f52e6e]/20 shadow-2xl card-print-override">
      <CardHeader className="border-b border-[#f52e6e]/10 bg-gradient-to-r from-[#f52e6e]/5 via-white to-[#0c3133]/5 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#f52e6e]/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
        <CardTitle className={`flex items-center gap-3 text-[#0c3133] relative z-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-[#f52e6e] to-[#0c3133] rounded-lg flex items-center justify-center shadow-lg">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-xl font-bold">{language === 'he' ? 'שדות חובה' : 'Mandatory Inputs'}</span>
            <p className="text-sm text-[#0c3133]/70 font-normal mt-1">{language === 'he' ? 'הזן את פרטי הארגון שלך' : 'Enter your organization\'s details'}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 bg-gradient-to-br from-white to-[#f9f9f9]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {inputs.map(({ label, field, placeholder, type, icon: Icon }) => (
            <div key={field} className="space-y-3">
              <Label htmlFor={field} className={`text-[#0c3133] font-semibold flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Icon className="w-4 h-4 text-[#f52e6e]" />
                <span className={`w-full ${isRTL ? 'text-right' : 'text-left'}`}>{label}</span>
              </Label>
              {field === 'autopilot_fee_month' ? (
                <Input
                  id={field}
                  type="text"
                  value={autopilotFeeStr}
                  onChange={handleAutopilotFeeChange}
                  onBlur={handleAutopilotFeeBlur}
                  placeholder={placeholder}
                  className={`border-2 border-[#f52e6e]/20 focus:border-[#f52e6e] focus:ring-[#f52e6e]/30 bg-white/80 backdrop-blur-sm text-[#0c3133] font-medium h-12 text-lg shadow-sm ${isRTL ? 'text-right' : ''}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              ) : (
                <Input
                  id={field}
                  type={type === 'number' ? 'text' : type}
                  value={type === 'number' ? formatNumber(values[field]) : values[field] || ""}
                  onChange={(e) => type === 'number' ? handleNumberChange(field, e.target.value) : onChange(field, e.target.value)}
                  placeholder={placeholder}
                  className={`border-2 border-[#f52e6e]/20 focus:border-[#f52e6e] focus:ring-[#f52e6e]/30 bg-white/80 backdrop-blur-sm text-[#0c3133] font-medium h-12 text-lg shadow-sm ${isRTL ? 'text-right' : ''}`}
                  dir={isRTL ? 'rtl' : 'ltr'}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
