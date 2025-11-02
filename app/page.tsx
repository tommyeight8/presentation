"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

const WMSCostBreakdown = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [userCount, setUserCount] = useState(1); // Changed to 1 for your setup
  const [orderVolume, setOrderVolume] = useState(400); // Your actual volume
  const [storageGB, setStorageGB] = useState(20); // Your actual storage

  // Calculate costs based on WMS usage - FIXED VERSION
  const calculateCosts = () => {
    // Supabase calculations
    const supabaseBase = 25; // Pro plan
    const dbStorage = storageGB > 8 ? (storageGB - 8) * 0.125 : 0;
    const fileStorage = storageGB > 100 ? (storageGB - 100) * 0.021 : 0;
    const bandwidth = ((orderVolume * 0.5) / 1000) * 0.09; // ~0.5GB per 1000 orders
    const maus = userCount > 100 ? (userCount - 100) * 0.00325 : 0;
    const supabaseTotal =
      supabaseBase + dbStorage + fileStorage + bandwidth + maus;

    // GCP calculations (for image/document storage)
    // Realistic calculation: 2-4 images per order (avg 3 images)
    // Image breakdown:
    // - Product photos: 1.5 per order × 400KB = 600KB
    // - QC/Damage photos: 1 per order × 800KB = 800KB
    // - Packing photos: 0.5 per order × 600KB = 300KB
    // Total per order: ~1.7MB of images

    // Monthly new images: orderVolume × 1.7MB = monthly growth
    const monthlyImagesMB = orderVolume * 1.7; // MB per month
    const monthlyImagesGB = monthlyImagesMB / 1024; // Convert to GB

    // Storage cost (cumulative - storageGB is total stored over time)
    const gcpStorage = storageGB * 0.02; // Standard storage at $0.020/GB

    // Operations cost
    // Upload operations: 3 images per order (Class A: $0.05 per 10K ops)
    const uploadOps = ((orderVolume * 3) / 10000) * 0.05;
    // Download operations: 4 views per order (Class B: $0.004 per 10K ops)
    const downloadOps = ((orderVolume * 4) / 10000) * 0.004;
    const gcpOperations = uploadOps + downloadOps;

    // Network egress (data transfer out)
    // Average 1.5MB downloaded per order (viewing images)
    const egressMB = orderVolume * 1.5;
    const egressGB = egressMB / 1024;
    const gcpEgress = egressGB * 0.12; // $0.12 per GB

    const gcpTotal = gcpStorage + gcpOperations + gcpEgress;

    // Vercel calculations - Pro plan $20/month + overages
    const vercelSeats = Math.ceil(userCount / 5) * 20; // $20 per seat
    const vercelBandwidthGB = orderVolume * 0.02; // 20MB per order

    // Pro plan includes $20 credit that applies to overages
    // But the seat cost itself is NOT covered by the credit
    const vercelCredit = 20; // $20 flexible credit for overages

    // Calculate bandwidth overage (beyond what credit covers)
    // Typical Pro usage is well within limits, but calculate potential overage
    const bandwidthOverageGB = Math.max(vercelBandwidthGB - 1000, 0); // 1TB included per seat
    const bandwidthCost = (bandwidthOverageGB / 1000) * 150; // $150 per TB

    // Edge function execution (usually minimal for WMS)
    const functionCalls = orderVolume * 5; // ~5 function calls per order
    const functionCost = Math.max(
      (functionCalls / 1000000) * 2 - vercelCredit,
      0
    ); // $2 per million, credit applies

    const vercelTotal = vercelSeats + bandwidthCost + Math.max(functionCost, 0);

    return {
      supabase: supabaseTotal,
      gcp: gcpTotal,
      vercel: vercelTotal,
      total: supabaseTotal + gcpTotal + vercelTotal,
    };
  };

  const costs = calculateCosts();

  // Calculate vercelSeats for display purposes
  const vercelSeats = Math.ceil(userCount / 5) * 20;

  // Monthly growth projection
  const growthProjection = [
    { month: "Month 1", orders: 300, cost: 26.6 },
    { month: "Month 2", orders: 400, cost: 26.79 },
    { month: "Month 3", orders: 500, cost: 26.98 },
    { month: "Month 4", orders: 750, cost: 27.51 },
    { month: "Month 5", orders: 1000, cost: 28.04 },
    { month: "Month 6", orders: 1500, cost: 29.08 },
  ];

  // Cost breakdown by service
  const costBreakdown = [
    { name: "Supabase", value: costs.supabase, color: "#3ECF8E" },
    { name: "GCP", value: costs.gcp, color: "#EA4335" },
    { name: "Vercel", value: costs.vercel, color: "#0070F3" },
  ];

  // Detailed WMS cost scenarios
  const scenarios = [
    {
      name: "Small Business",
      orders: 400,
      users: 1,
      storage: 20,
      supabase: 26.52,
      gcp: 0.27,
      vercel: 20, // 1 seat = $20 (credit covers overages)
      total: 46.79,
    },
    {
      name: "Growing Business",
      orders: 2000,
      users: 5,
      storage: 100,
      supabase: 32.36,
      gcp: 2.24,
      vercel: 20, // 1 seat = $20 (5 users fit in 1 seat)
      total: 54.6,
    },
    {
      name: "Enterprise",
      orders: 10000,
      users: 20,
      storage: 500,
      supabase: 85.5,
      gcp: 10.74,
      vercel: 80, // 4 seats = $80
      total: 176.24,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold">
                WMS Tech Stack Cost Breakdown
              </h1>
              <p className="mt-2 text-xl text-blue-100">
                Complete cost analysis for Supabase + GCP + Vercel
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-200">
                Estimated Monthly Cost
              </div>
              <div className="text-5xl font-bold">
                ${costs.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-wrap gap-1 bg-white rounded-lg p-1 shadow-sm">
          {["overview", "calculator", "your-setup"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab === "your-setup"
                ? "Your Setup"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Current Cost Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Monthly Cost Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={costBreakdown.filter((item) => item.value > 0)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) =>
                        `${entry.name}: $${entry.value.toFixed(2)}`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdown
                        .filter((item) => item.value > 0)
                        .map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => `$${Number(value).toFixed(2)}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Cost Summary */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">
                  Cost Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">
                        Supabase (Backend)
                      </div>
                      <div className="text-sm text-slate-600">
                        Database, Auth, Functions, Real-time
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      ${costs.supabase.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">
                        GCP (Storage)
                      </div>
                      <div className="text-sm text-slate-600">
                        Images, Documents, Labels
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-red-600">
                      ${costs.gcp.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">
                        Vercel Pro (Frontend)
                      </div>
                      <div className="text-sm text-slate-600">
                        $20/seat + overages (if any)
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${costs.vercel.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-purple-100 rounded-lg border-2 border-purple-500">
                    <div>
                      <div className="font-bold text-slate-800 text-lg">
                        Total Monthly Cost
                      </div>
                      <div className="text-sm text-slate-600">
                        All services combined
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-purple-600">
                      ${costs.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Projection */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                6-Month Cost Projection
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={growthProjection}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    yAxisId="left"
                    label={{
                      value: "Monthly Orders",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "Cost (USD)",
                      angle: 90,
                      position: "insideRight",
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="#3B82F6"
                    fill="#93C5FD"
                    name="Orders"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="cost"
                    stroke="#10B981"
                    fill="#6EE7B7"
                    name="Cost ($)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm text-slate-600 text-center">
                Costs scale gradually as your order volume grows
              </p>
            </div>
          </div>
        )}

        {/* Calculator Tab */}
        {activeTab === "calculator" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Custom Cost Calculator
              </h3>
              <p className="text-slate-600 mb-6">
                Adjust the sliders to estimate costs for your specific WMS needs
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Development Team Size
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={userCount}
                    onChange={(e) => setUserCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>1</span>
                    <span className="font-bold text-blue-600">
                      {userCount} devs
                    </span>
                    <span>20</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Developers who need to deploy code
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Monthly Order Volume
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    value={orderVolume}
                    onChange={(e) => setOrderVolume(parseInt(e.target.value))}
                    className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>100</span>
                    <span className="font-bold text-green-600">
                      {orderVolume.toLocaleString()} orders
                    </span>
                    <span>10K</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Storage Required (GB)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={storageGB}
                    onChange={(e) => setStorageGB(parseInt(e.target.value))}
                    className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>10GB</span>
                    <span className="font-bold text-red-600">
                      {storageGB}GB
                    </span>
                    <span>500GB</span>
                  </div>
                </div>
              </div>

              {/* Calculated Costs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                  <div className="text-sm text-slate-600 mb-1">Supabase</div>
                  <div className="text-3xl font-bold text-green-600">
                    ${costs.supabase.toFixed(2)}
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                  <div className="text-sm text-slate-600 mb-1">
                    Google Cloud
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    ${costs.gcp.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {((orderVolume * 1.7) / 1024).toFixed(2)}GB/month growth
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                  <div className="text-sm text-slate-600 mb-1">Vercel Pro</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ${costs.vercel.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    ${vercelSeats}/mo + overages
                  </div>
                </div>

                <div className="bg-purple-100 rounded-lg p-6 border-2 border-purple-500">
                  <div className="text-sm text-slate-600 mb-1">Total Cost</div>
                  <div className="text-3xl font-bold text-purple-600">
                    ${costs.total.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* GCP Detailed Breakdown */}
              <div className="mt-8 p-6 bg-red-50 rounded-lg border-2 border-red-200">
                <h4 className="font-bold text-lg text-slate-800 mb-4 flex items-center">
                  <span className="text-xl mr-2">☁️</span>
                  GCP Cost Breakdown (Images: 2-4 per order, avg 3)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Storage */}
                  <div>
                    <div className="font-semibold text-red-600 mb-2">
                      Storage:
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Current stored:</span>
                        <span className="font-semibold">{storageGB}GB</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly growth:</span>
                        <span className="font-semibold">
                          {((orderVolume * 1.7) / 1024).toFixed(2)}GB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost ($0.02/GB):</span>
                        <span className="font-semibold">
                          ${(storageGB * 0.02).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        Images per order: ~3 (avg)
                        <br />
                        Size per order: ~1.7MB
                      </div>
                    </div>
                  </div>

                  {/* Operations */}
                  <div>
                    <div className="font-semibold text-red-600 mb-2">
                      Operations:
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Uploads (Class A):</span>
                        <span className="font-semibold">
                          ${(((orderVolume * 3) / 10000) * 0.05).toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Downloads (Class B):</span>
                        <span className="font-semibold">
                          ${(((orderVolume * 4) / 10000) * 0.004).toFixed(3)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1">
                        <span>Total ops:</span>
                        <span className="font-semibold">
                          $
                          {(
                            ((orderVolume * 3) / 10000) * 0.05 +
                            ((orderVolume * 4) / 10000) * 0.004
                          ).toFixed(3)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        3 uploads + 4 views per order
                      </div>
                    </div>
                  </div>

                  {/* Egress */}
                  <div>
                    <div className="font-semibold text-red-600 mb-2">
                      Network Egress:
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Downloads/month:</span>
                        <span className="font-semibold">
                          {((orderVolume * 1.5) / 1024).toFixed(2)}GB
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cost ($0.12/GB):</span>
                        <span className="font-semibold">
                          ${(((orderVolume * 1.5) / 1024) * 0.12).toFixed(3)}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-2">
                        ~1.5MB downloaded per order
                        <br />
                        (viewing images in app)
                      </div>
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                        <strong>💡 Tip:</strong> Enable CDN to save 60-70%!
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Image Growth */}
                <div className="mt-4 p-4 bg-white rounded-lg">
                  <div className="font-semibold text-slate-800 mb-2">
                    📊 Storage Growth Projection:
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600">
                    <div>
                      <div className="font-semibold">Month 1:</div>
                      <div>{((orderVolume * 1.7) / 1024).toFixed(2)}GB</div>
                    </div>
                    <div>
                      <div className="font-semibold">Month 6:</div>
                      <div>{((orderVolume * 1.7 * 6) / 1024).toFixed(2)}GB</div>
                    </div>
                    <div>
                      <div className="font-semibold">Month 12:</div>
                      <div>
                        {((orderVolume * 1.7 * 12) / 1024).toFixed(2)}GB
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">Your limit:</div>
                      <div className="text-green-600 font-bold">
                        {(storageGB / ((orderVolume * 1.7) / 1024)).toFixed(1)}{" "}
                        months
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annual Projection */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-slate-800">
                      Annual Cost Estimate
                    </div>
                    <div className="text-sm text-slate-600">
                      ${(costs.total / orderVolume).toFixed(4)} per order
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-purple-600">
                      ${(costs.total * 12).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600">per year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Your Setup Tab */}
        {activeTab === "your-setup" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl shadow-lg p-8">
              <h3 className="text-3xl font-bold mb-2">
                Your Specific WMS Setup
              </h3>
              <p className="text-purple-100 text-lg mb-6">
                1 developer • 10 warehouse workers • 400 orders/month • 20GB
                storage
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6 text-slate-800">
                  <div className="text-sm text-slate-600 mb-1">
                    Monthly Cost
                  </div>
                  <div className="text-5xl font-bold text-purple-600">
                    $46.79
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    All services included
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-slate-800">
                  <div className="text-sm text-slate-600 mb-1">Annual Cost</div>
                  <div className="text-5xl font-bold text-blue-600">$561</div>
                  <div className="text-xs text-slate-500 mt-2">
                    Projected yearly spend
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 text-slate-800">
                  <div className="text-sm text-slate-600 mb-1">Per Order</div>
                  <div className="text-5xl font-bold text-green-600">
                    $0.117
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    11.7 cents per order
                  </div>
                </div>
              </div>
            </div>

            {/* Bandwidth Optimization Best Practices */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <span className="text-3xl mr-3">🚀</span>
                <h4 className="text-2xl font-bold text-slate-800">
                  Bandwidth Optimization Best Practices
                </h4>
              </div>

              <div className="space-y-6">
                {/* Vercel Bandwidth */}
                <div className="border-2 border-blue-500 rounded-lg p-6 bg-blue-50">
                  <h5 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📊</span>
                    Vercel Bandwidth Optimization
                  </h5>

                  <div className="mb-4 p-4 bg-blue-100 rounded-lg">
                    <div className="font-semibold text-slate-800 mb-2">
                      Current Usage Estimate:
                    </div>
                    <div className="text-sm text-slate-600">
                      • 400 orders/month × 20MB = <strong>8GB/month</strong>
                      <br />• Included: <strong>1,000GB (1TB)</strong> per seat
                      <br />• Status:{" "}
                      <strong className="text-green-600">
                        Well within limits! ✅
                      </strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        1. Optimize Images
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Use Next.js Image component:</strong>{" "}
                            Automatic optimization, lazy loading
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Enable WebP format:</strong> 25-35% smaller
                            than JPEG
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Responsive images:</strong> Serve different
                            sizes per device
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Set quality to 75-80:</strong> Barely
                            noticeable difference
                          </span>
                        </li>
                      </ul>
                      <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                        <strong>💰 Savings:</strong> Reduce image bandwidth by
                        50-70%
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        2. Code Splitting
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Dynamic imports:</strong> Load components on
                            demand
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Route-based splitting:</strong> Automatic in
                            Next.js
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Tree shaking:</strong> Remove unused code
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Bundle analysis:</strong> Use
                            @next/bundle-analyzer
                          </span>
                        </li>
                      </ul>
                      <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                        <strong>💰 Savings:</strong> Reduce JS bundle size by
                        30-50%
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        3. Caching Strategy
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Static assets:</strong> Cache-Control:
                            public, max-age=31536000
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>API responses:</strong> Use
                            stale-while-revalidate
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>ISR for pages:</strong> Incremental Static
                            Regeneration
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>CDN at edge:</strong> Vercel Edge Network
                            handles this
                          </span>
                        </li>
                      </ul>
                      <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                        <strong>💰 Savings:</strong> Reduce repeat bandwidth by
                        60-80%
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        4. Compression
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Brotli compression:</strong> Automatic on
                            Vercel (20% better than gzip)
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Minify CSS/JS:</strong> Next.js does this
                            automatically
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Remove source maps:</strong> In production
                            builds
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-blue-600 mr-2">✓</span>
                          <span>
                            <strong>Compress fonts:</strong> Use woff2 format
                          </span>
                        </li>
                      </ul>
                      <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                        <strong>💰 Savings:</strong> Already enabled! Free
                        compression
                      </div>
                    </div>
                  </div>
                </div>

                {/* GCP Bandwidth */}
                <div className="border-2 border-red-500 rounded-lg p-6 bg-red-50">
                  <h5 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">☁️</span>
                    GCP Egress Optimization
                  </h5>

                  <div className="mb-4 p-4 bg-red-100 rounded-lg">
                    <div className="font-semibold text-slate-800 mb-2">
                      ⚠️ This is your biggest cost driver!
                    </div>
                    <div className="text-sm text-slate-600">
                      GCP egress is <strong>89% of your GCP costs</strong>{" "}
                      ($0.24 out of $0.27)
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        1. Enable Cloud CDN
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Cache at edge:</strong> Serve from Google's
                            global network
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Reduce origin hits:</strong> 70-90%
                            reduction in egress
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Set cache headers:</strong> Cache-Control
                            for images
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Cost:</strong> $0.04-0.08/GB (vs $0.12/GB
                            egress)
                          </span>
                        </li>
                      </ul>
                      <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                        <strong>💰 Savings:</strong> $0.16-0.20/month (67-74%
                        reduction!)
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        2. Image Optimization
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Compress before upload:</strong> Use
                            imagemin or sharp
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Target 100-200KB per image:</strong> Instead
                            of 400KB
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Use WebP/AVIF:</strong> 30-50% smaller than
                            JPEG
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Generate thumbnails:</strong> Serve smaller
                            versions in lists
                          </span>
                        </li>
                      </ul>
                      <div className="mt-3 p-2 bg-green-50 rounded text-xs">
                        <strong>💰 Savings:</strong> Cut egress in half!
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        3. Signed URLs & Caching
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Use signed URLs:</strong> Enable CDN caching
                            with security
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Long TTL for images:</strong> 1 year cache
                            for product photos
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Browser caching:</strong> Set cache headers
                            properly
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        4. Lazy Loading
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Load on demand:</strong> Only fetch images
                            when visible
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Intersection Observer:</strong> Load as user
                            scrolls
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-red-600 mr-2">✓</span>
                          <span>
                            <strong>Loading="lazy":</strong> Native browser lazy
                            loading
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Supabase Bandwidth */}
                <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
                  <h5 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🗄️</span>
                    Supabase Bandwidth Optimization
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        Query Optimization
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>
                            <strong>Select specific columns:</strong>{" "}
                            .select('id, name') not .select('*')
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>
                            <strong>Paginate results:</strong> Limit to 50-100
                            per query
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>
                            <strong>Use count():</strong> Instead of fetching
                            all rows
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-3">
                        Frontend Caching
                      </h6>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>
                            <strong>React Query / SWR:</strong> Cache API
                            responses
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>
                            <strong>Dedupe requests:</strong> Automatic with SWR
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span>
                            <strong>Stale-while-revalidate:</strong> Instant UI
                            updates
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Monitoring & Alerts */}
                <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
                  <h5 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <span className="text-2xl mr-2">📊</span>
                    Monitoring & Alerts
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-2">
                        Vercel
                      </h6>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Analytics dashboard</li>
                        <li>• Spend Management (enabled by default)</li>
                        <li>• Set budget alerts at 50%, 75%, 90%</li>
                        <li>• Default $200/month limit</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-2">GCP</h6>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Cloud Monitoring</li>
                        <li>• Budget alerts in Billing</li>
                        <li>• Track egress by bucket</li>
                        <li>• Set up usage quotas</li>
                      </ul>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <h6 className="font-semibold text-slate-800 mb-2">
                        Supabase
                      </h6>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>• Usage dashboard</li>
                        <li>• Bandwidth graphs</li>
                        <li>• Email alerts at 80%</li>
                        <li>• API analytics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Quick Wins */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
                  <h5 className="text-xl font-bold mb-4">
                    🎯 Quick Wins (Do These First!)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                    <div className="bg-white bg-opacity-20 rounded-lg p-4">
                      <div className="font-bold mb-2">Immediate Actions:</div>
                      <ol className="space-y-1 text-sm list-decimal list-inside">
                        <li>Enable GCP Cloud CDN (biggest impact!)</li>
                        <li>Use Next.js Image component everywhere</li>
                        <li>Compress images before upload (imagemin)</li>
                        <li>Set proper Cache-Control headers</li>
                      </ol>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-4">
                      <div className="font-bold mb-2">Expected Savings:</div>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • GCP egress: <strong>-$0.16/month (67%)</strong>
                        </li>
                        <li>• Vercel bandwidth: Already optimized ✓</li>
                        <li>
                          • Supabase: <strong>-$0.01/month</strong>
                        </li>
                        <li>
                          • <strong>Total: Save ~$0.17/month</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-2xl font-bold text-slate-800 mb-6">
                Cost Comparison vs Alternatives
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border-2 border-purple-500 rounded-lg p-6 bg-purple-50">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🎯</div>
                    <div className="font-bold text-xl text-slate-800">
                      Your Custom WMS
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-purple-600">
                      $46.79
                    </div>
                    <div className="text-sm text-slate-600 mt-2">per month</div>
                  </div>
                </div>

                <div className="border-2 border-slate-300 rounded-lg p-6 bg-slate-50">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="font-bold text-xl text-slate-800">
                      ShipStation
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-slate-600">$29</div>
                    <div className="text-sm text-slate-600 mt-2">
                      Shipping only
                    </div>
                  </div>
                </div>

                <div className="border-2 border-slate-300 rounded-lg p-6 bg-slate-50">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🏢</div>
                    <div className="font-bold text-xl text-slate-800">
                      ShipBob 3PL
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-slate-600">
                      $160+
                    </div>
                    <div className="text-sm text-slate-600 mt-2">
                      3PL services
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WMSCostBreakdown;
