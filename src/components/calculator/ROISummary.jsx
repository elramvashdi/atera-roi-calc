import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Users, Zap, Eye, Shield, DollarSign } from "lucide-react";

export default function ROISummary({ calculations }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const savingsBreakdown = [
    {
      title: "Technician Time Savings",
      amount: calculations.technicianTimeSavings || 0,
      description: "Reduced technician involvement per ticket",
      icon: Clock,
      color: "bg-blue-500"
    },
    {
      title: "Hiring Cost Reduction",
      amount: calculations.hiringCostReduction || 0,
      description: "Savings from avoiding new hires",
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Employee Productivity Gains",
      amount: calculations.employeeProductivityGains || 0,
      description: "Value of reduced wait time for employees",
      icon: TrendingUp,
      color: "bg-purple-500"
    },
    {
      title: "Software Cost Elimination",
      amount: calculations.softwareCostElimination || 0,
      description: "Savings from eliminated software/tools",
      icon: Shield,
      color: "bg-orange-500"
    },
    {
      title: "Instant Response Value",
      amount: calculations.instantResponseValue || 0,
      description: "Productivity from zero response time",
      icon: Zap,
      color: "bg-emerald-500"
    },
    {
      title: "Unreported Issues Value",
      amount: calculations.unreportedIssuesValue || 0,
      description: "Hidden productivity loss recovery",
      icon: Eye,
      color: "bg-rose-500"
    },
    {
      title: "SLA Comparison Savings",
      amount: calculations.slaComparisonSavings || 0,
      description: "Cost to match Autopilot's SLA with humans",
      icon: Shield,
      color: "bg-indigo-500"
    }
  ];

  const totalSavings = savingsBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalCost = calculations.totalCost || 0;
  const netBenefit = totalSavings - totalCost;
  const roiPercentage = totalCost > 0 ? ((netBenefit / totalCost) * 100) : 0;
  const paybackMonths = totalSavings > 0 ? (totalCost / (totalSavings / 12)) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="text-blue-100 text-sm font-medium">Total Annual Savings</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(totalSavings)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="text-green-100 text-sm font-medium">ROI Percentage</div>
            <div className="text-2xl font-bold mt-1">{roiPercentage.toFixed(0)}%</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="text-purple-100 text-sm font-medium">Payback Period</div>
            <div className="text-2xl font-bold mt-1">{paybackMonths.toFixed(1)} months</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="text-orange-100 text-sm font-medium">Total Cost</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(totalCost)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Savings Breakdown */}
      <Card className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-xl">
        <CardHeader className="border-b border-slate-100">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Annual Savings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {savingsBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    <div className="text-sm text-slate-600">{item.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-slate-900">{formatCurrency(item.amount)}</div>
                  <div className="text-sm text-slate-500">
                    {((item.amount / totalSavings) * 100).toFixed(1)}% of total
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-slate-900">Total Annual Savings</span>
              <span className="text-blue-600">{formatCurrency(totalSavings)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}