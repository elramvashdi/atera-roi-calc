import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Clock, Users, Zap, Eye, Shield } from "lucide-react";

export default function CalculationResults({ values, calculations }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(Math.round(number));
  };

  const intermediateCalcs = [
    {
      label: "Total tickets per month",
      value: calculations.totalTicketsMonth,
      format: formatNumber
    },
    {
      label: "Number of tickets automatically resolved per month",
      value: calculations.ticketsAutoResolvedMonth,
      format: formatNumber
    },
    {
      label: "Number of assisted tickets per month",
      value: calculations.assistedTicketsMonth,
      format: formatNumber
    },
    {
      label: "Number of hours saved with autonomous resolution",
      value: calculations.hoursAutonomousResolution,
      format: formatNumber
    },
    {
      label: "Number of hours saved with assisted resolution",
      value: calculations.hoursAssistedResolution,
      format: formatNumber
    },
    {
      label: "Tech hours saved per year",
      value: calculations.techHoursSavedYear,
      format: formatNumber
    },
    {
      label: "Avoided new hires per year",
      value: calculations.avoidedHires,
      format: (val) => val.toFixed(1)
    },
    {
      label: "Total annual employee lost hours",
      value: calculations.employeeLostHours,
      format: formatNumber
    },
    {
      label: "Total annual employee hours saved",
      value: calculations.employeeHoursSaved,
      format: formatNumber
    }
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <Calculator className="w-5 h-5 text-blue-600" />
          Intermediate Calculations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {intermediateCalcs.map((calc, index) => (
            <div key={index} className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-lg border border-slate-200">
              <div className="text-sm text-slate-600 mb-1">{calc.label}</div>
              <div className="text-lg font-semibold text-slate-900">
                {calc.format(calc.value || 0)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}