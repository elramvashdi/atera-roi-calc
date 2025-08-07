import React, { useState, useEffect } from "react";
import { ROICalculation } from "@/api/entities";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, Building2, Download, Eye, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Reports() {
  const [calculations, setCalculations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);
      
      // Filter calculations by current user
      const allCalculations = await ROICalculation.list("-created_date");
      const userCalculations = allCalculations.filter(calc => calc.created_by === user.email);
      setCalculations(userCalculations);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);

  const exportCalculation = (calc) => {
    const blob = new Blob([JSON.stringify(calc, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roi-report-${calc.company_name}-${format(new Date(calc.created_date), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const editCalculation = (calc) => {
    // Store the calculation data in localStorage to load in the calculator
    localStorage.setItem('editCalculation', JSON.stringify(calc));
    // Navigate to calculator
    window.location.href = createPageUrl("Calculator");
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-64 bg-slate-200 rounded-lg"></div>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved ROI Calculations</h1>
        <p className="text-slate-600 text-lg">View and manage your saved ROI calculations.</p>
      </div>

      {calculations.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Saved Calculations</h3>
            <p className="text-slate-600 mb-4">Create an ROI calculation to see your reports here.</p>
            <Link to={createPageUrl("Calculator")}>
              <Button className="bg-[#f52e6e] hover:bg-[#f52e6e]/90 text-white">
                Create New Calculation
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculations.map((calc) => (
            <Card key={calc.id} className="bg-white/70 backdrop-blur-sm border-slate-200/60 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg"><Building2 className="w-5 h-5 text-blue-600" />{calc.company_name}</CardTitle>
                  <Badge variant="outline" className="text-xs"><Calendar className="w-3 h-3 mr-1" />{format(new Date(calc.created_date), 'MMM d, yyyy')}</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {calc.results && (
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-700">Annual Savings</div>
                        <div className="text-lg font-bold text-green-600">{formatCurrency(calc.results.total_savings || 0)}</div>
                      </div>
                       <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-700">ROI</div>
                        <div className="text-lg font-bold text-blue-600">{((calc.results.roi || 0) * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-3 border-t border-slate-100">
                    <Button variant="outline" size="sm" onClick={() => editCalculation(calc)} className="flex-1 text-xs">
                      <Edit2 className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportCalculation(calc)} className="flex-1 text-xs">
                      <Download className="w-3 h-3 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}