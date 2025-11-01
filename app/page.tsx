"use client";

import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
  const [userCount, setUserCount] = useState(10);
  const [orderVolume, setOrderVolume] = useState(1000);
  const [storageGB, setStorageGB] = useState(50);

  // Calculate costs based on WMS usage
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
    const gcpStorage = storageGB * 0.02; // Standard storage
    const gcpOperations = ((orderVolume * 10) / 10000) * 0.05; // 10 operations per order
    const gcpEgress = ((orderVolume * 0.2) / 1000) * 0.12; // ~200MB per 1000 orders
    const gcpTotal = gcpStorage + gcpOperations + gcpEgress;

    // Vercel calculations
    const vercelSeats = Math.ceil(userCount / 5) * 20; // Assuming dev team, not warehouse users
    const vercelBandwidth = ((orderVolume * 0.3) / 1000) * 150; // Extra bandwidth cost
    const vercelTotal = vercelSeats + vercelBandwidth;

    return {
      supabase: supabaseTotal,
      gcp: gcpTotal,
      vercel: vercelTotal,
      total: supabaseTotal + gcpTotal + vercelTotal,
    };
  };

  const costs = calculateCosts();

  // Monthly growth projection
  const growthProjection = [
    { month: "Month 1", orders: 500, cost: 85 },
    { month: "Month 2", orders: 800, cost: 95 },
    { month: "Month 3", orders: 1000, cost: Math.round(costs.total) },
    { month: "Month 4", orders: 1500, cost: Math.round(costs.total * 1.3) },
    { month: "Month 5", orders: 2000, cost: Math.round(costs.total * 1.5) },
    { month: "Month 6", orders: 3000, cost: Math.round(costs.total * 2) },
  ];

  // Cost breakdown by service
  const costBreakdown = [
    { name: "Supabase", value: costs.supabase, color: "#3ECF8E" },
    { name: "GCP", value: costs.gcp, color: "#EA4335" },
    { name: "Vercel", value: costs.vercel, color: "#0070F3" }, // Changed from #000000 to Vercel's brand blue
  ];

  // Feature usage breakdown
  const featureUsage = [
    {
      feature: "Database",
      service: "Supabase",
      usage: "Orders, inventory, users, locations",
    },
    {
      feature: "Authentication",
      service: "Supabase",
      usage: "Staff login, role-based access",
    },
    {
      feature: "Real-time",
      service: "Supabase",
      usage: "Live inventory updates, notifications",
    },
    {
      feature: "Edge Functions",
      service: "Supabase",
      usage: "Shopify webhooks, label generation",
    },
    {
      feature: "File Storage (Docs)",
      service: "GCP",
      usage: "Shipping labels, packing slips, invoices",
    },
    {
      feature: "Image Storage",
      service: "GCP",
      usage: "Product images, order photos, audit trail",
    },
    {
      feature: "Frontend Hosting",
      service: "Vercel",
      usage: "Admin dashboard, mobile picking app",
    },
    {
      feature: "API Routes",
      service: "Vercel",
      usage: "ShipEngine integration, webhooks",
    },
    {
      feature: "Edge Network",
      service: "Vercel",
      usage: "Global access, low latency",
    },
  ];

  // Detailed WMS cost scenarios
  const scenarios = [
    {
      name: "Startup (Small)",
      orders: 500,
      users: 5,
      storage: 20,
      supabase: 25,
      gcp: 2,
      vercel: 40,
      total: 67,
    },
    {
      name: "Growing (Medium)",
      orders: 2000,
      users: 15,
      storage: 100,
      supabase: 35,
      gcp: 8,
      vercel: 80,
      total: 123,
    },
    {
      name: "Established (Large)",
      orders: 5000,
      users: 30,
      storage: 300,
      supabase: 85,
      gcp: 25,
      vercel: 120,
      total: 230,
    },
    {
      name: "Enterprise",
      orders: 10000,
      users: 50,
      storage: 1000,
      supabase: 250,
      gcp: 80,
      vercel: 200,
      total: 530,
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
          {[
            "overview",
            "calculator",
            "architecture",
            "breakdown",
            "scenarios",
            "optimization",
            "your-setup",
          ].map((tab) => (
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
            {/* Tech Stack Overview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Your WMS Tech Stack
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Supabase */}
                <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      S
                    </div>
                    <div className="ml-3">
                      <h4 className="text-xl font-bold text-slate-800">
                        Supabase
                      </h4>
                      <p className="text-sm text-green-600">
                        Backend & Database
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>PostgreSQL Database:</strong> Orders, inventory,
                        users, locations, shipments
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Authentication:</strong> Staff login, role-based
                        access control
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Real-time:</strong> Live inventory updates,
                        order notifications via Ably
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Edge Functions:</strong> Shopify webhooks,
                        ShipEngine integration
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Row Level Security:</strong> Data isolation per
                        warehouse/client
                      </span>
                    </div>
                  </div>
                </div>

                {/* GCP */}
                <div className="border-2 border-red-500 rounded-lg p-6 bg-red-50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      G
                    </div>
                    <div className="ml-3">
                      <h4 className="text-xl font-bold text-slate-800">
                        Google Cloud
                      </h4>
                      <p className="text-sm text-red-600">
                        File & Image Storage
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Product Images:</strong> High-res photos for
                        picking/verification
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Order Documentation:</strong> Uploaded photos,
                        damage reports
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Shipping Labels:</strong> PDF storage from
                        ShipEngine
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Packing Slips:</strong> Generated documents
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Audit Trail Images:</strong> QC photos, location
                        scans
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vercel */}
                <div className="border-2 border-black rounded-lg p-6 bg-slate-50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
                      V
                    </div>
                    <div className="ml-3">
                      <h4 className="text-xl font-bold text-slate-800">
                        Vercel
                      </h4>
                      <p className="text-sm text-slate-600">Frontend Hosting</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Admin Dashboard:</strong> Next.js app for
                        warehouse management
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Mobile Picking App:</strong> Responsive
                        interface for warehouse staff
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>API Routes:</strong> Serverless functions for
                        integrations
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Edge Deployment:</strong> Fast global access for
                        remote users
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Preview Deployments:</strong> Test features
                        before production
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                      data={costBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) =>
                        `${props.name}: $${props.value.toFixed(2)}`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {costBreakdown.map((entry, index) => (
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

                  <div className="flex justify-between items-center p-4 bg-slate-100 rounded-lg">
                    <div>
                      <div className="font-semibold text-slate-800">
                        Vercel (Frontend)
                      </div>
                      <div className="text-sm text-slate-600">
                        Hosting, Edge, Functions
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">
                      ${costs.vercel.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-4 bg-blue-100 rounded-lg border-2 border-blue-500">
                    <div>
                      <div className="font-bold text-slate-800 text-lg">
                        Total Monthly Cost
                      </div>
                      <div className="text-sm text-slate-600">
                        All services combined
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
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
                As your order volume grows, costs scale predictably with
                usage-based pricing
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
                {/* Dev Team Size */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Development Team Size
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={userCount}
                    onChange={(e) => setUserCount(parseInt(e.target.value))}
                    className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-sm text-slate-600 mt-1">
                    <span>1</span>
                    <span className="font-bold text-blue-600">
                      {userCount} users
                    </span>
                    <span>50</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Developers, admins, managers (not warehouse staff)
                  </p>
                </div>

                {/* Monthly Orders */}
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
                  <p className="text-xs text-slate-500 mt-2">
                    Shopify orders processed per month
                  </p>
                </div>

                {/* Storage */}
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
                  <p className="text-xs text-slate-500 mt-2">
                    Images, documents, labels, database
                  </p>
                </div>
              </div>

              {/* Calculated Costs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
                  <div className="text-sm text-slate-600 mb-1">Supabase</div>
                  <div className="text-3xl font-bold text-green-600">
                    ${costs.supabase.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Base: $25 + usage overages
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-6 border-2 border-red-200">
                  <div className="text-sm text-slate-600 mb-1">
                    Google Cloud
                  </div>
                  <div className="text-3xl font-bold text-red-600">
                    ${costs.gcp.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Storage + operations + egress
                  </div>
                </div>

                <div className="bg-slate-100 rounded-lg p-6 border-2 border-slate-300">
                  <div className="text-sm text-slate-600 mb-1">Vercel</div>
                  <div className="text-3xl font-bold text-slate-800">
                    ${costs.vercel.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    $20/seat + bandwidth
                  </div>
                </div>

                <div className="bg-blue-100 rounded-lg p-6 border-2 border-blue-500">
                  <div className="text-sm text-slate-600 mb-1">Total Cost</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ${costs.total.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500 mt-2">Per month</div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="mt-8 p-6 bg-slate-50 rounded-lg">
                <h4 className="font-bold text-lg text-slate-800 mb-4">
                  Detailed Cost Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Supabase Details */}
                  <div>
                    <div className="font-semibold text-green-600 mb-2">
                      Supabase Components:
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Base Pro Plan:</span>
                        <span className="font-semibold">$25.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra DB Storage:</span>
                        <span className="font-semibold">
                          $
                          {(storageGB > 8
                            ? (storageGB - 8) * 0.125
                            : 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bandwidth:</span>
                        <span className="font-semibold">
                          ${(((orderVolume * 0.5) / 1000) * 0.09).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra MAUs:</span>
                        <span className="font-semibold">
                          $
                          {(userCount > 100
                            ? (userCount - 100) * 0.00325
                            : 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-bold text-green-600">
                        <span>Subtotal:</span>
                        <span>${costs.supabase.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* GCP Details */}
                  <div>
                    <div className="font-semibold text-red-600 mb-2">
                      GCP Components:
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Storage ({storageGB}GB):</span>
                        <span className="font-semibold">
                          ${(storageGB * 0.02).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Operations:</span>
                        <span className="font-semibold">
                          ${(((orderVolume * 10) / 10000) * 0.05).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Network Egress:</span>
                        <span className="font-semibold">
                          ${(((orderVolume * 0.2) / 1000) * 0.12).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-bold text-red-600">
                        <span>Subtotal:</span>
                        <span>${costs.gcp.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vercel Details */}
                  <div>
                    <div className="font-semibold text-slate-800 mb-2">
                      Vercel Components:
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>Pro Seats ({Math.ceil(userCount / 5)}):</span>
                        <span className="font-semibold">
                          ${(Math.ceil(userCount / 5) * 20).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra Bandwidth:</span>
                        <span className="font-semibold">
                          ${(((orderVolume * 0.3) / 1000) * 150).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Included Credits:</span>
                        <span className="font-semibold text-green-600">
                          -$20.00
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-1 font-bold text-slate-800">
                        <span>Subtotal:</span>
                        <span>${costs.vercel.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Annual Projection */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-lg text-slate-800">
                      Annual Cost Estimate
                    </div>
                    <div className="text-sm text-slate-600">
                      Based on current configuration
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-blue-600">
                      ${(costs.total * 12).toFixed(2)}
                    </div>
                    <div className="text-sm text-slate-600">per year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Architecture Tab */}
        {activeTab === "architecture" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                WMS Architecture & Data Flow
              </h3>

              {/* Architecture Diagram */}
              <div className="bg-slate-50 rounded-lg p-8 mb-6">
                <div className="flex flex-col space-y-4">
                  {/* Layer 1: Frontend */}
                  <div className="bg-black text-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="font-bold text-lg mb-2">
                        🌐 Frontend Layer - Vercel
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="bg-white bg-opacity-10 rounded p-3">
                          <div className="font-semibold">Admin Dashboard</div>
                          <div className="text-xs text-gray-300">
                            Order management, inventory control
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded p-3">
                          <div className="font-semibold">
                            Mobile Picking App
                          </div>
                          <div className="text-xs text-gray-300">
                            Warehouse operations, scanning
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-10 rounded p-3">
                          <div className="font-semibold">API Routes</div>
                          <div className="text-xs text-gray-300">
                            ShipEngine, webhooks integration
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="text-4xl text-slate-400">↕️</div>
                  </div>

                  {/* Layer 2: Backend */}
                  <div className="bg-green-500 text-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="font-bold text-lg mb-2">
                        ⚡ Backend Layer - Supabase
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">PostgreSQL</div>
                          <div className="text-xs">
                            Orders, inventory, users, locations
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Authentication</div>
                          <div className="text-xs">Staff login, RLS, roles</div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Real-time</div>
                          <div className="text-xs">
                            Live updates, Ably integration
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Edge Functions</div>
                          <div className="text-xs">Webhooks, automation</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="text-4xl text-slate-400">↕️</div>
                  </div>

                  {/* Layer 3: Storage */}
                  <div className="bg-red-500 text-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="font-bold text-lg mb-2">
                        📦 Storage Layer - Google Cloud
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Product Images</div>
                          <div className="text-xs">
                            High-res photos for picking
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Documents</div>
                          <div className="text-xs">
                            Labels, packing slips, invoices
                          </div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Audit Trail</div>
                          <div className="text-xs">
                            QC photos, damage reports
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="text-4xl text-slate-400">↕️</div>
                  </div>

                  {/* Layer 4: Integrations */}
                  <div className="bg-blue-600 text-white rounded-lg p-4">
                    <div className="text-center">
                      <div className="font-bold text-lg mb-2">
                        🔌 External Integrations
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-4 text-sm">
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Shopify</div>
                          <div className="text-xs">Order sync, fulfillment</div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">ShipEngine</div>
                          <div className="text-xs">Label creation, rates</div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Ably</div>
                          <div className="text-xs">Real-time notifications</div>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded p-3">
                          <div className="font-semibold">Inventory Planner</div>
                          <div className="text-xs">Forecasting, analytics</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Mapping Table */}
              <h4 className="text-xl font-bold text-slate-800 mb-4">
                Feature-to-Service Mapping
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold text-slate-700">
                        WMS Feature
                      </th>
                      <th className="py-3 px-4 text-left font-bold text-slate-700">
                        Service
                      </th>
                      <th className="py-3 px-4 text-left font-bold text-slate-700">
                        Implementation
                      </th>
                      <th className="py-3 px-4 text-left font-bold text-slate-700">
                        Cost Impact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureUsage.map((item, index) => (
                      <tr key={index} className="border-b border-slate-200">
                        <td className="py-3 px-4 font-medium">
                          {item.feature}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              item.service === "Supabase"
                                ? "bg-green-100 text-green-700"
                                : item.service === "GCP"
                                ? "bg-red-100 text-red-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {item.service}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {item.usage}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-slate-500">
                            {item.service === "Supabase"
                              ? "Usage-based"
                              : item.service === "GCP"
                              ? "Per GB + ops"
                              : "Per seat"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Flow */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                Typical Order Processing Flow
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">
                      Order Received
                    </div>
                    <div className="text-sm text-slate-600">
                      Shopify webhook → Supabase Edge Function → PostgreSQL
                      insert
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      Cost: Minimal function execution
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">
                      Inventory Check
                    </div>
                    <div className="text-sm text-slate-600">
                      PostgreSQL query → Update inventory reservation →
                      Real-time notification via Ably
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Cost: Included in database operations
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">
                      Picking Assignment
                    </div>
                    <div className="text-sm text-slate-600">
                      Admin assigns → Update PostgreSQL → Real-time push to
                      mobile picker app
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Cost: Database updates + bandwidth
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">
                      Picking Process
                    </div>
                    <div className="text-sm text-slate-600">
                      Mobile app loads product images from GCP → Barcode scan →
                      Status updates
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      Cost: GCP egress + operations
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">
                      Photo Documentation
                    </div>
                    <div className="text-sm text-slate-600">
                      Upload damage/QC photos → GCP Cloud Storage → URL saved in
                      PostgreSQL
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      Cost: GCP storage + upload bandwidth
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    6
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">
                      Shipping Label Creation
                    </div>
                    <div className="text-sm text-slate-600">
                      ShipEngine API call via Vercel serverless → PDF stored in
                      GCP → Label printed
                    </div>
                    <div className="text-xs text-red-600 mt-1">
                      Cost: GCP storage + Vercel function execution
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    7
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800">
                      Fulfillment & Sync
                    </div>
                    <div className="text-sm text-slate-600">
                      Mark shipped in PostgreSQL → Trigger Shopify fulfillment →
                      Customer notification
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      Cost: Edge function + minimal bandwidth
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Tab - Continuing in next message due to length... */}
        {activeTab === "breakdown" && (
          <div className="space-y-6">
            {/* Supabase Detailed Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  S
                </div>
                <h3 className="ml-3 text-2xl font-bold text-slate-800">
                  Supabase - Complete Breakdown
                </h3>
              </div>

              {/* Base Plan */}
              <div className="mb-6">
                <div className="bg-green-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-lg text-slate-800">
                        Pro Plan Base
                      </h4>
                      <p className="text-sm text-slate-600">
                        Required tier for production WMS
                      </p>
                    </div>
                    <div className="text-3xl font-bold text-green-600">
                      $25.00
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="text-xs text-slate-500">Database</div>
                    <div className="font-semibold text-slate-800">
                      8 GB included
                    </div>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="text-xs text-slate-500">File Storage</div>
                    <div className="font-semibold text-slate-800">
                      100 GB included
                    </div>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="text-xs text-slate-500">Bandwidth</div>
                    <div className="font-semibold text-slate-800">
                      250 GB included
                    </div>
                  </div>
                  <div className="border border-green-200 rounded-lg p-4">
                    <div className="text-xs text-slate-500">MAUs</div>
                    <div className="font-semibold text-slate-800">
                      100,000 included
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage-Based Components */}
              <div>
                <h4 className="font-bold text-lg text-slate-800 mb-4">
                  Usage-Based Costs (Beyond Included)
                </h4>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">
                          Database Storage
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          • Orders table: ~500KB per 1000 orders
                          <br />
                          • Inventory table: ~200KB per 1000 SKUs
                          <br />
                          • User/location data: ~50KB per location
                          <br />• Shipment audit trail: ~300KB per 1000
                          shipments
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          Estimated: 8GB sufficient for first ~100K orders
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-green-600">$0.125</div>
                        <div className="text-xs text-slate-500">
                          per GB/month
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">
                          Bandwidth (Egress)
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          • Mobile app data sync: ~50MB per 1000 picks
                          <br />
                          • Dashboard queries: ~100MB per 1000 orders viewed
                          <br />
                          • Real-time subscriptions: ~20MB per 1000 updates
                          <br />• API responses: ~30MB per 1000 API calls
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          Estimated: 250GB covers ~2500 orders/month
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-green-600">$0.09</div>
                        <div className="text-xs text-slate-500">per GB</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">
                          Monthly Active Users (MAU)
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          • Warehouse staff (not counted - internal system)
                          <br />
                          • Admin users: Counted as MAUs
                          <br />
                          • API service accounts: Not typically counted
                          <br />• Mobile app users: Counted if they log in
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          100K included easily covers all staff logins
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-green-600">$0.00325</div>
                        <div className="text-xs text-slate-500">per MAU</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">
                          Compute (Database Instance)
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          • Micro instance (free with $10 credit): Good for
                          &lt;1000 orders/month
                          <br />
                          • Small instance (~$15/mo): 1000-5000 orders/month
                          <br />
                          • Medium instance (~$60/mo): 5000-20000 orders/month
                          <br />• Can scale up/down as needed
                        </div>
                        <div className="text-xs text-slate-500 mt-2">
                          $10 monthly credit included in Pro plan
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-green-600">Varies</div>
                        <div className="text-xs text-slate-500">by size</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GCP Detailed Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  G
                </div>
                <h3 className="ml-3 text-2xl font-bold text-slate-800">
                  Google Cloud Platform - Complete Breakdown
                </h3>
              </div>

              <div className="space-y-6">
                {/* Storage Costs */}
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-4">
                    Storage Costs (Standard Class)
                  </h4>
                  <div className="bg-red-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-800">
                          Per GB Storage Cost
                        </div>
                        <p className="text-sm text-slate-600">
                          US Region (Standard Storage)
                        </p>
                      </div>
                      <div className="text-3xl font-bold text-red-600">
                        $0.020
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-red-200 rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Product Images
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>• Average size: 500KB per product</div>
                        <div>• 1000 products = ~500MB</div>
                        <div>
                          • 10,000 products = ~5GB ={" "}
                          <strong>$0.10/month</strong>
                        </div>
                        <div>• Multiple variants/angles increase storage</div>
                      </div>
                    </div>
                    <div className="border border-red-200 rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Order Documentation
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        <div>• Damage photos: ~2MB per order (if taken)</div>
                        <div>• QC photos: ~1MB per order</div>
                        <div>• Shipping labels (PDF): ~100KB each</div>
                        <div>
                          • 1000 orders/month = ~3GB ={" "}
                          <strong>$0.06/month</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Operations Costs */}
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-4">
                    Operations Costs
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-semibold text-slate-800">
                          Class A Operations
                        </div>
                        <div className="font-bold text-red-600">
                          $0.05{" "}
                          <span className="text-xs font-normal text-slate-500">
                            / 10K ops
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600">
                        • PUT (upload), POST, LIST operations
                        <br />
                        • Uploading images: ~1 op per image
                        <br />
                        • Creating shipping labels: ~1 op per label
                        <br />• Example: 1000 uploads = <strong>$0.005</strong>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <div className="font-semibold text-slate-800">
                          Class B Operations
                        </div>
                        <div className="font-bold text-red-600">
                          $0.004{" "}
                          <span className="text-xs font-normal text-slate-500">
                            / 10K ops
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-slate-600">
                        • GET (download), HEAD operations
                        <br />
                        • Loading product images for picking: ~2 ops per pick
                        <br />
                        • Viewing damage photos: ~1 op per view
                        <br />• Example: 10000 views = <strong>$0.004</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Network Egress */}
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-4">
                    Network Egress (Data Transfer Out)
                  </h4>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">
                          Internet Egress Cost
                        </div>
                        <div className="text-sm text-slate-600 mt-2">
                          • Loading images in mobile app: ~500KB per product
                          view
                          <br />
                          • Downloading shipping labels: ~100KB per label
                          <br />
                          • Viewing damage photos: ~2MB per photo
                          <br />
                          • Serving via CDN reduces costs significantly
                          <br />
                          <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                            <strong>💡 Tip:</strong> Use Cloud CDN to reduce
                            egress by 60-80%
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-red-600">$0.12</div>
                        <div className="text-xs text-slate-500">per GB</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Optimization Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-bold text-slate-800 mb-2">
                    💰 GCP Cost Optimization
                  </h5>
                  <div className="text-sm text-slate-600 space-y-1">
                    • Use Nearline ($0.010/GB) for older order documentation
                    (30+ days)
                    <br />
                    • Use Coldline ($0.004/GB) for archived images (90+ days)
                    <br />
                    • Implement lifecycle policies to auto-transition storage
                    classes
                    <br />
                    • Compress images before upload (reduce storage by 30-50%)
                    <br />
                    • Use Cloud CDN for frequently accessed product images
                    <br />• Set up proper caching headers to reduce redundant
                    downloads
                  </div>
                </div>
              </div>
            </div>

            {/* Vercel Detailed Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  V
                </div>
                <h3 className="ml-3 text-2xl font-bold text-slate-800">
                  Vercel Pro - Complete Breakdown
                </h3>
              </div>

              <div className="space-y-6">
                {/* Seat-Based Pricing */}
                <div>
                  <div className="bg-slate-100 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg text-slate-800">
                          Pro Plan Per Seat
                        </h4>
                        <p className="text-sm text-slate-600">
                          For developers who deploy code
                        </p>
                      </div>
                      <div className="text-3xl font-bold text-black">
                        $20<span className="text-lg text-slate-500">/seat</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border border-slate-300 rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Who Needs a Paid Seat?
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        • Developers who push code ✅<br />
                        • Team members who trigger deployments ✅<br />
                        • Users who modify project settings ✅<br />
                        • Warehouse staff viewing the app ❌ (FREE viewers)
                        <br />• Clients/stakeholders reviewing ❌ (FREE viewers)
                      </div>
                    </div>
                    <div className="border border-slate-300 rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Typical WMS Team
                      </div>
                      <div className="text-sm text-slate-600 space-y-1">
                        • 2-3 Full-stack developers: <strong>$40-60/mo</strong>
                        <br />• 1 DevOps/admin: <strong>$20/mo</strong>
                        <br />• 1 Project manager (viewer):{" "}
                        <strong>FREE</strong>
                        <br />• Warehouse users (viewers): <strong>FREE</strong>
                        <br />• <strong>Total: $60-80/month</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Included Credits */}
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-4">
                    Included Monthly Credits
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="font-semibold text-slate-800">
                        Flexible Credits
                      </div>
                      <div className="text-2xl font-bold text-blue-600 my-2">
                        $20
                      </div>
                      <div className="text-xs text-slate-600">
                        Can be used across any Vercel resources (compute,
                        bandwidth, etc.)
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="font-semibold text-slate-800">
                        Data Transfer
                      </div>
                      <div className="text-2xl font-bold text-blue-600 my-2">
                        $150+
                      </div>
                      <div className="text-xs text-slate-600">
                        Dedicated to Fast Data Transfer (CDN bandwidth)
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="font-semibold text-slate-800">
                        Edge Requests
                      </div>
                      <div className="text-2xl font-bold text-blue-600 my-2">
                        $20+
                      </div>
                      <div className="text-xs text-slate-600">
                        Dedicated to edge network requests
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-green-50 rounded text-sm text-slate-600">
                    <strong>✅ For most WMS workloads:</strong> Included credits
                    cover all usage. Extra charges only if you exceed these
                    generous limits.
                  </div>
                </div>

                {/* Usage-Based Costs (if exceeded) */}
                <div>
                  <h4 className="font-bold text-lg text-slate-800 mb-4">
                    Additional Costs (Beyond Included Credits)
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">
                            Bandwidth (Data Transfer)
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            • Static assets (JS, CSS, images): Served from edge
                            <br />
                            • API responses from serverless functions
                            <br />
                            • Most WMS apps: &lt;100GB/month total
                            <br />• Included credits typically cover this
                            entirely
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-slate-800">$150</div>
                          <div className="text-xs text-slate-500">per TB</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">
                            Serverless Function Execution
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            • ShipEngine API wrapper: ~500ms per call
                            <br />
                            • Shopify webhook handlers: ~200ms per webhook
                            <br />
                            • 1000 orders = ~1000 function calls = minimal cost
                            <br />• Charged per GB-hour of compute
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-slate-800">Varies</div>
                          <div className="text-xs text-slate-500">GB-hour</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="font-semibold text-slate-800">
                            Build Minutes
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            • Concurrent builds included
                            <br />
                            • Typical Next.js build: 2-5 minutes
                            <br />
                            • Deploy 10x per day = ~40 mins/day
                            <br />• Usually well within generous limits
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="font-bold text-slate-800">
                            Included
                          </div>
                          <div className="text-xs text-slate-500">
                            unlimited
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spend Management */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-bold text-slate-800 mb-2">
                    🛡️ Built-in Spend Management
                  </h5>
                  <div className="text-sm text-slate-600">
                    • Default $200 monthly budget (customizable)
                    <br />
                    • Email/SMS alerts at 50%, 75%, 90%, 100%
                    <br />
                    • Optional hard limit to pause projects at 100%
                    <br />
                    • Recursion protection prevents runaway costs
                    <br />• For a typical WMS, you'll likely never exceed the
                    included credits
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios Tab */}
        {activeTab === "scenarios" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">
                Cost Scenarios by Business Size
              </h3>
              <p className="text-slate-600 mb-8">
                Realistic monthly cost projections based on actual WMS usage
                patterns across different business scales
              </p>

              <div className="space-y-6">
                {scenarios.map((scenario, index) => (
                  <div
                    key={index}
                    className="border-2 border-slate-200 rounded-xl p-6 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                      <div>
                        <h4 className="text-2xl font-bold text-slate-800">
                          {scenario.name}
                        </h4>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                          <span>
                            📦 {scenario.orders.toLocaleString()} orders/month
                          </span>
                          <span>👥 {scenario.users} team members</span>
                          <span>💾 {scenario.storage}GB storage</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 text-right">
                        <div className="text-sm text-slate-500">
                          Total Monthly Cost
                        </div>
                        <div className="text-4xl font-bold text-blue-600">
                          ${scenario.total}
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="text-xs text-slate-500 mb-1">
                          Supabase
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          ${scenario.supabase}
                        </div>
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (scenario.supabase / scenario.total) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {((scenario.supabase / scenario.total) * 100).toFixed(
                            0
                          )}
                          % of total
                        </div>
                      </div>

                      <div className="bg-red-50 rounded-lg p-4">
                        <div className="text-xs text-slate-500 mb-1">
                          GCP Storage
                        </div>
                        <div className="text-2xl font-bold text-red-600">
                          ${scenario.gcp}
                        </div>
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (scenario.gcp / scenario.total) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {((scenario.gcp / scenario.total) * 100).toFixed(0)}%
                          of total
                        </div>
                      </div>

                      <div className="bg-slate-100 rounded-lg p-4">
                        <div className="text-xs text-slate-500 mb-1">
                          Vercel
                        </div>
                        <div className="text-2xl font-bold text-slate-800">
                          ${scenario.vercel}
                        </div>
                        <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-slate-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (scenario.vercel / scenario.total) * 100
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {((scenario.vercel / scenario.total) * 100).toFixed(
                            0
                          )}
                          % of total
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 flex flex-col justify-center">
                        <div className="text-xs text-slate-500 mb-1">
                          Annual Cost
                        </div>
                        <div className="text-xl font-bold text-blue-600">
                          ${(scenario.total * 12).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          ~$
                          {(
                            (scenario.total * 12) /
                            scenario.orders /
                            12
                          ).toFixed(3)}
                          /order
                        </div>
                      </div>
                    </div>

                    {/* Scenario Details */}
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h5 className="font-semibold text-slate-800 mb-3">
                        What This Includes:
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                        <div>
                          <div className="font-semibold text-green-600 mb-1">
                            Supabase:
                          </div>
                          <ul className="space-y-1 text-xs">
                            <li>• Full PostgreSQL database</li>
                            <li>• Staff authentication & RLS</li>
                            <li>• Real-time notifications</li>
                            <li>• Edge Functions for webhooks</li>
                            <li>• Daily backups</li>
                          </ul>
                        </div>
                        <div>
                          <div className="font-semibold text-red-600 mb-1">
                            GCP:
                          </div>
                          <ul className="space-y-1 text-xs">
                            <li>• Product image library</li>
                            <li>• Damage/QC photo storage</li>
                            <li>• Shipping label PDFs</li>
                            <li>• Packing slip documents</li>
                            <li>• 99.9% availability SLA</li>
                          </ul>
                        </div>
                        <div>
                          <div className="font-semibold text-slate-700 mb-1">
                            Vercel:
                          </div>
                          <ul className="space-y-1 text-xs">
                            <li>• Admin dashboard hosting</li>
                            <li>• Mobile picking app</li>
                            <li>• Global edge network</li>
                            <li>• Unlimited deployments</li>
                            <li>• Preview environments</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Chart */}
              <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-6">
                  Side-by-Side Comparison
                </h4>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={scenarios}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      label={{
                        value: "Monthly Cost (USD)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="supabase"
                      stackId="a"
                      fill="#3ECF8E"
                      name="Supabase"
                    />
                    <Bar dataKey="gcp" stackId="a" fill="#EA4335" name="GCP" />
                    <Bar
                      dataKey="vercel"
                      stackId="a"
                      fill="#000000"
                      name="Vercel"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === "optimization" && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-8 mb-6">
              <h3 className="text-3xl font-bold mb-2">
                💰 Cost Optimization Strategies
              </h3>
              <p className="text-green-100 text-lg">
                Proven tactics to reduce your WMS infrastructure costs by 30-50%
              </p>
            </div>

            {/* Supabase Optimizations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                  S
                </div>
                <h4 className="ml-3 text-xl font-bold text-slate-800">
                  Supabase Optimization
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-green-200 rounded-lg p-5 bg-green-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">📊</span>
                    Database Optimization
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Implement proper indexes:</strong> Speeds up
                        queries, reduces compute time
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Archive old orders:</strong> Move orders &gt;90
                        days to separate table or export
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Use views strategically:</strong> Materialize
                        expensive queries
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Optimize RLS policies:</strong> Simpler policies
                        = faster queries
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-green-700 font-semibold">
                    💡 Potential Savings: Stay on Micro instance longer, save
                    ~$40/mo
                  </div>
                </div>

                <div className="border border-green-200 rounded-lg p-5 bg-green-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">📡</span>
                    Bandwidth Reduction
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Use select() strategically:</strong> Only fetch
                        needed columns
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Implement pagination:</strong> Limit results to
                        50-100 per query
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Cache on frontend:</strong> Reduce redundant API
                        calls
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Compress responses:</strong> Enable gzip
                        compression
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-green-700 font-semibold">
                    💡 Potential Savings: Reduce bandwidth costs by 40-60%
                  </div>
                </div>

                <div className="border border-green-200 rounded-lg p-5 bg-green-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">⚡</span>
                    Function Optimization
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Batch operations:</strong> Process multiple
                        items in one function call
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Use database triggers:</strong> For simple
                        operations instead of functions
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Optimize cold starts:</strong> Keep functions
                        warm during business hours
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-green-700 font-semibold">
                    💡 Potential Savings: Minimal, but improves performance
                  </div>
                </div>

                <div className="border border-green-200 rounded-lg p-5 bg-green-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">🔒</span>
                    Storage Optimization
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Move large files to GCP:</strong> Don't store
                        images in Supabase Storage
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Implement lifecycle policies:</strong>{" "}
                        Auto-delete old temporary files
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Compress before upload:</strong> Reduce storage
                        footprint
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-green-700 font-semibold">
                    💡 Potential Savings: Avoid file storage overages
                  </div>
                </div>
              </div>
            </div>

            {/* GCP Optimizations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                  G
                </div>
                <h4 className="ml-3 text-xl font-bold text-slate-800">
                  GCP Optimization
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-red-200 rounded-lg p-5 bg-red-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">📦</span>
                    Storage Classes
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Use Nearline for old orders:</strong> $0.010/GB
                        vs $0.020/GB (50% savings)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Use Coldline for archives:</strong> $0.004/GB
                        (80% savings)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Automate with lifecycle:</strong> Move files
                        automatically after 30/90 days
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-red-700 font-semibold">
                    💡 Savings: Up to 80% on older files
                  </div>
                </div>

                <div className="border border-red-200 rounded-lg p-5 bg-red-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">🖼️</span>
                    Image Optimization
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Compress before upload:</strong> Use WebP
                        format, reduce size by 30-50%
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Generate thumbnails:</strong> Serve smaller
                        versions for lists
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Lazy loading:</strong> Only load images when
                        needed
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-red-700 font-semibold">
                    💡 Savings: 30-50% on storage + egress
                  </div>
                </div>

                <div className="border border-red-200 rounded-lg p-5 bg-red-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">🌐</span>
                    CDN & Caching
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Enable Cloud CDN:</strong> Reduces egress costs
                        dramatically
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Set proper cache headers:</strong> Cache-Control
                        for static assets
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-600 mr-2">•</span>
                      <span>
                        <strong>Use signed URLs:</strong> Cache with security
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-red-700 font-semibold">
                    💡 Savings: 60-80% on egress bandwidth
                  </div>
                </div>
              </div>
            </div>

            {/* Vercel Optimizations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                  V
                </div>
                <h4 className="ml-3 text-xl font-bold text-slate-800">
                  Vercel Optimization
                </h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-slate-300 rounded-lg p-5 bg-slate-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">👥</span>
                    Team Management
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Use free Viewer seats:</strong> Give
                        stakeholders view-only access
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Right-size team:</strong> Only pay for users who
                        deploy
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Remove inactive users:</strong> Audit monthly
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-slate-700 font-semibold">
                    💡 Savings: $20/mo per unnecessary paid seat
                  </div>
                </div>

                <div className="border border-slate-300 rounded-lg p-5 bg-slate-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">⚙️</span>
                    Build Optimization
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Use Incremental Static Regeneration:</strong>{" "}
                        Faster builds, less compute
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Optimize dependencies:</strong> Remove unused
                        packages
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Cache build outputs:</strong> Speeds up
                        deployments
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-slate-700 font-semibold">
                    💡 Savings: Mostly performance gains
                  </div>
                </div>

                <div className="border border-slate-300 rounded-lg p-5 bg-slate-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">📊</span>
                    Function Optimization
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Use Edge Functions:</strong> Faster, cheaper
                        than serverless
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Minimize cold starts:</strong> Keep functions
                        under 50MB
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Implement caching:</strong> Cache API responses
                        at edge
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-slate-700 font-semibold">
                    💡 Savings: Stay within included credits
                  </div>
                </div>

                <div className="border border-slate-300 rounded-lg p-5 bg-slate-50">
                  <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                    <span className="text-xl mr-2">🚀</span>
                    Bandwidth Optimization
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Optimize images:</strong> Use Next.js Image
                        component
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Code splitting:</strong> Only load needed
                        JavaScript
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>Compress assets:</strong> Brotli compression
                        automatic
                      </span>
                    </li>
                  </ul>
                  <div className="mt-3 p-2 bg-white rounded text-xs text-slate-700 font-semibold">
                    💡 Savings: Stay within included bandwidth
                  </div>
                </div>
              </div>
            </div>

            {/* General Best Practices */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-xl font-bold text-slate-800 mb-6">
                🎯 General Best Practices
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h5 className="font-bold text-slate-800 mb-3">
                    📈 Monitor Usage
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Set up billing alerts in all platforms</li>
                    <li>• Review monthly reports</li>
                    <li>• Track cost per order metric</li>
                    <li>• Identify usage spikes early</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h5 className="font-bold text-slate-800 mb-3">
                    🔄 Regular Audits
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Monthly: Review team seats</li>
                    <li>• Quarterly: Clean up old data</li>
                    <li>• Bi-annually: Optimize queries</li>
                    <li>• Annually: Evaluate alternatives</li>
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h5 className="font-bold text-slate-800 mb-3">
                    💡 Smart Architecture
                  </h5>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>• Right tool for right job</li>
                    <li>• Don't over-engineer</li>
                    <li>• Start small, scale up</li>
                    <li>• Measure before optimizing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-8">
              <h4 className="text-2xl font-bold mb-4">
                💰 ROI Quick Calculator
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-2">If you optimize by 30%:</div>
                  <div className="text-3xl font-bold">
                    ${(costs.total * 0.3 * 12).toFixed(0)}
                  </div>
                  <div className="text-sm mt-1">saved per year</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-2">Cost per order (current):</div>
                  <div className="text-3xl font-bold">
                    ${(costs.total / orderVolume).toFixed(3)}
                  </div>
                  <div className="text-sm mt-1">per order processed</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-2">
                    Cost per order (optimized):
                  </div>
                  <div className="text-3xl font-bold">
                    ${((costs.total * 0.7) / orderVolume).toFixed(3)}
                  </div>
                  <div className="text-sm mt-1">with 30% savings</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Your Setup Tab */}
        {activeTab === "your-setup" && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-xl shadow-lg p-8">
              <h3 className="text-3xl font-bold mb-2">
                Your Specific WMS Setup
              </h3>
              <p className="text-purple-100 text-lg mb-6">
                Detailed cost analysis for your warehouse configuration
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-1">Warehouse Workers</div>
                  <div className="text-3xl font-bold">10</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-1">Storage Need</div>
                  <div className="text-3xl font-bold">20GB</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-1">Monthly Orders</div>
                  <div className="text-3xl font-bold">300-500</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="text-sm mb-1">Dev Team</div>
                  <div className="text-3xl font-bold">1</div>
                </div>
              </div>
            </div>

            {/* Total Cost Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-purple-500">
                <div className="text-sm text-slate-600 mb-1">Monthly Cost</div>
                <div className="text-5xl font-bold text-purple-600">$46.79</div>
                <div className="text-xs text-slate-500 mt-2">
                  All services included
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500">
                <div className="text-sm text-slate-600 mb-1">Annual Cost</div>
                <div className="text-5xl font-bold text-blue-600">$561</div>
                <div className="text-xs text-slate-500 mt-2">
                  Projected yearly spend
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-500">
                <div className="text-sm text-slate-600 mb-1">
                  Cost Per Order
                </div>
                <div className="text-5xl font-bold text-green-600">$0.117</div>
                <div className="text-xs text-slate-500 mt-2">
                  11.7 cents per order
                </div>
              </div>
            </div>

            {/* Service Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-2xl font-bold text-slate-800 mb-6">
                Detailed Service Breakdown
              </h4>

              <div className="space-y-6">
                {/* Supabase */}
                <div className="border-2 border-green-500 rounded-lg p-6 bg-green-50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                        S
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-slate-800">
                          Supabase
                        </h5>
                        <p className="text-sm text-slate-600">
                          Backend & Database (57% of total)
                        </p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-green-600">
                      $26.52
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Cost Components
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Pro Plan Base:</span>
                          <span className="font-semibold">$25.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Extra Storage (12GB):</span>
                          <span className="font-semibold">$1.50</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bandwidth (400 orders):</span>
                          <span className="font-semibold">$0.02</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-bold text-green-600">
                          <span>Monthly Total:</span>
                          <span>$26.52</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        What You Get
                      </div>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>✅ PostgreSQL for all order data</li>
                        <li>✅ Auth for 10 workers (FREE)</li>
                        <li>✅ Real-time updates via Ably</li>
                        <li>✅ Edge Functions for webhooks</li>
                        <li>✅ Row Level Security</li>
                        <li>✅ Daily backups included</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* GCP */}
                <div className="border-2 border-red-500 rounded-lg p-6 bg-red-50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                        G
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-slate-800">
                          Google Cloud Platform
                        </h5>
                        <p className="text-sm text-slate-600">
                          Image & File Storage (&lt;1% of total)
                        </p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-red-600">$0.27</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Cost Components
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Storage (1.00GB):</span>
                          <span className="font-semibold">$0.02</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Upload Operations:</span>
                          <span className="font-semibold">$0.01</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Download Operations:</span>
                          <span className="font-semibold">$0.001</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Network Egress:</span>
                          <span className="font-semibold">$0.24</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-bold text-red-600">
                          <span>Monthly Total:</span>
                          <span>$0.27</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Usage Details
                      </div>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>📦 1,800 images/month (4.5 per order)</li>
                        <li>📄 400 shipping labels (PDFs)</li>
                        <li>🖼️ Product photos at 400KB each</li>
                        <li>📋 QC & damage documentation</li>
                        <li>💾 Total: 1GB storage used</li>
                        <li>⚠️ Egress is 89% of cost</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Vercel */}
                <div className="border-2 border-black rounded-lg p-6 bg-slate-50">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
                        V
                      </div>
                      <div>
                        <h5 className="text-xl font-bold text-slate-800">
                          Vercel
                        </h5>
                        <p className="text-sm text-slate-600">
                          Frontend Hosting (44% of total)
                        </p>
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-slate-800">
                      $20.00
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Cost Components
                      </div>
                      <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Pro Seat (1 dev):</span>
                          <span className="font-semibold">$20.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Included Credits:</span>
                          <span className="font-semibold text-green-600">
                            Covers all usage
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Extra Bandwidth:</span>
                          <span className="font-semibold">$0.00</span>
                        </div>
                        <div className="flex justify-between border-t pt-2 font-bold text-slate-800">
                          <span>Monthly Total:</span>
                          <span>$20.00</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="font-semibold text-slate-800 mb-2">
                        Important Notes
                      </div>
                      <ul className="space-y-1 text-sm text-slate-600">
                        <li>
                          👥 10 warehouse workers ={" "}
                          <strong className="text-green-600">FREE</strong>{" "}
                          (viewers)
                        </li>
                        <li>💻 Only 1 dev needs a paid seat</li>
                        <li>🚀 Admin dashboard hosting</li>
                        <li>📱 Mobile picking app</li>
                        <li>🌍 Global edge network</li>
                        <li>🔄 Unlimited deployments</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Scaling Comparison */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-2xl font-bold text-slate-800 mb-6">
                How Your Costs Scale
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold">
                        Orders/Month
                      </th>
                      <th className="py-3 px-4 text-right font-bold">
                        Supabase
                      </th>
                      <th className="py-3 px-4 text-right font-bold">GCP</th>
                      <th className="py-3 px-4 text-right font-bold">Vercel</th>
                      <th className="py-3 px-4 text-right font-bold">Total</th>
                      <th className="py-3 px-4 text-right font-bold">Annual</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">300</td>
                      <td className="py-3 px-4 text-right">$26.40</td>
                      <td className="py-3 px-4 text-right">$0.20</td>
                      <td className="py-3 px-4 text-right">$20.00</td>
                      <td className="py-3 px-4 text-right font-bold">$46.60</td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        $559
                      </td>
                    </tr>
                    <tr className="border-b bg-purple-50">
                      <td className="py-3 px-4 font-bold">400 (Current)</td>
                      <td className="py-3 px-4 text-right font-bold">$26.52</td>
                      <td className="py-3 px-4 text-right font-bold">$0.27</td>
                      <td className="py-3 px-4 text-right font-bold">$20.00</td>
                      <td className="py-3 px-4 text-right font-bold text-purple-600">
                        $46.79
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-purple-600">
                        $561
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">500</td>
                      <td className="py-3 px-4 text-right">$26.64</td>
                      <td className="py-3 px-4 text-right">$0.34</td>
                      <td className="py-3 px-4 text-right">$20.00</td>
                      <td className="py-3 px-4 text-right font-bold">$46.98</td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        $564
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">750</td>
                      <td className="py-3 px-4 text-right">$27.00</td>
                      <td className="py-3 px-4 text-right">$0.51</td>
                      <td className="py-3 px-4 text-right">$20.00</td>
                      <td className="py-3 px-4 text-right font-bold">$47.51</td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        $570
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">1,000</td>
                      <td className="py-3 px-4 text-right">$27.36</td>
                      <td className="py-3 px-4 text-right">$0.68</td>
                      <td className="py-3 px-4 text-right">$20.00</td>
                      <td className="py-3 px-4 text-right font-bold">$48.04</td>
                      <td className="py-3 px-4 text-right text-slate-600">
                        $576
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-600">
                  <strong>💡 Key Insight:</strong> Doubling your orders (400 →
                  1000) only increases costs by{" "}
                  <strong className="text-blue-600">$1.29/month</strong>. Your
                  setup is extremely cost-efficient and scales gradually!
                </p>
              </div>
            </div>

            {/* Compared to Alternatives */}
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
                    <div className="text-sm text-slate-600">
                      Supabase + GCP + Vercel
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-purple-600">
                      $46.79
                    </div>
                    <div className="text-sm text-slate-600 mt-2">per month</div>
                  </div>
                  <div className="mt-4 text-xs text-slate-600 text-center">
                    Complete WMS with full features
                  </div>
                </div>

                <div className="border-2 border-slate-300 rounded-lg p-6 bg-slate-50">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">📦</div>
                    <div className="font-bold text-xl text-slate-800">
                      ShipStation
                    </div>
                    <div className="text-sm text-slate-600">
                      SaaS WMS Solution
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-slate-600">
                      $29-59
                    </div>
                    <div className="text-sm text-slate-600 mt-2">per month</div>
                  </div>
                  <div className="mt-4 text-xs text-slate-600 text-center">
                    + $0.10 per label, limited features
                  </div>
                </div>

                <div className="border-2 border-slate-300 rounded-lg p-6 bg-slate-50">
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-2">🏢</div>
                    <div className="font-bold text-xl text-slate-800">
                      ShipBob
                    </div>
                    <div className="text-sm text-slate-600">3PL + Software</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-bold text-slate-600">
                      $160-240
                    </div>
                    <div className="text-sm text-slate-600 mt-2">per month</div>
                  </div>
                  <div className="mt-4 text-xs text-slate-600 text-center">
                    $0.40-0.60 per order (400 orders)
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-green-50 border-2 border-green-500 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-slate-800 mb-2">
                    💰 Your Savings
                  </div>
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    50-90% Cheaper
                  </div>
                  <p className="text-sm text-slate-600">
                    You're saving <strong>$113-193 per month</strong> compared
                    to alternatives, while maintaining full control and
                    customization!
                  </p>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-8">
              <h4 className="text-2xl font-bold mb-6">
                What Your $46.79/month Includes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-bold mb-2">✅ Complete WMS</div>
                  <ul className="text-sm space-y-1">
                    <li>• Order management</li>
                    <li>• Inventory tracking</li>
                    <li>• Pick/pack/ship workflows</li>
                    <li>• Barcode scanning</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-bold mb-2">✅ For 10 Workers</div>
                  <ul className="text-sm space-y-1">
                    <li>• Mobile picking app</li>
                    <li>• Staff authentication</li>
                    <li>• Role-based access</li>
                    <li>• Real-time updates</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-bold mb-2">✅ Integrations</div>
                  <ul className="text-sm space-y-1">
                    <li>• Shopify sync</li>
                    <li>• ShipEngine labels</li>
                    <li>• Ably notifications</li>
                    <li>• Inventory Planner</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-bold mb-2">✅ Storage & Files</div>
                  <ul className="text-sm space-y-1">
                    <li>• 20GB database</li>
                    <li>• Unlimited images</li>
                    <li>• PDF labels & slips</li>
                    <li>• Audit trail photos</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-bold mb-2">✅ Infrastructure</div>
                  <ul className="text-sm space-y-1">
                    <li>• 99.9% uptime SLA</li>
                    <li>• Global CDN</li>
                    <li>• Daily backups</li>
                    <li>• SSL/HTTPS</li>
                  </ul>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4">
                  <div className="font-bold mb-2">✅ Support</div>
                  <ul className="text-sm space-y-1">
                    <li>• Email support</li>
                    <li>• Documentation</li>
                    <li>• Community forums</li>
                    <li>• Unlimited deploys</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h4 className="text-2xl font-bold text-slate-800 mb-6">
                💡 Recommendations for Your Setup
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      You're Already Optimized
                    </div>
                    <p className="text-sm text-slate-600">
                      At 400 orders/month, your cost structure is efficient.
                      Optimization would only save ~$3/month - not worth the
                      effort yet.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    →
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Focus on Growth
                    </div>
                    <p className="text-sm text-slate-600">
                      Your infrastructure can scale to 5-10x current volume with
                      minimal cost increase. Focus on growing your business, not
                      optimizing pennies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold">
                    ⏰
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Optimize Later
                    </div>
                    <p className="text-sm text-slate-600">
                      When you hit 2,000+ orders/month or if GCP costs exceed
                      $5/month, then implement CDN and lifecycle policies.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold">
                    👥
                  </div>
                  <div>
                    <div className="font-bold text-slate-800">
                      Team Costs are Fixed
                    </div>
                    <p className="text-sm text-slate-600">
                      Adding warehouse workers = $0 extra (they're free
                      viewers). Each additional developer = +$20/month.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Line */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg p-8 text-center">
              <div className="text-3xl font-bold mb-4">✨ Bottom Line</div>
              <div className="text-xl mb-6">
                Your WMS costs less than one dinner out per month!
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div>
                  <div className="text-4xl font-bold">$46.79</div>
                  <div className="text-sm">per month</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">$0.117</div>
                  <div className="text-sm">per order</div>
                </div>
                <div>
                  <div className="text-4xl font-bold">10+</div>
                  <div className="text-sm">users supported</div>
                </div>
              </div>
              <div className="mt-6 text-lg">
                You're running a <strong>production-grade WMS</strong> for less
                than the cost of streaming services! 🎉
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="bg-slate-800 text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-2">
              Summary: Complete WMS Stack
            </h3>
            <p className="text-slate-300 text-lg">
              All three services working together for your warehouse management
              system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-5xl mb-2">🗄️</div>
              <div className="text-xl font-bold mb-2">Backend Power</div>
              <div className="text-slate-300 text-sm">
                Supabase handles all your data, auth, and real-time needs
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">📦</div>
              <div className="text-xl font-bold mb-2">Reliable Storage</div>
              <div className="text-slate-300 text-sm">
                GCP stores images, documents, and files with 99.9% uptime
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">🚀</div>
              <div className="text-xl font-bold mb-2">Fast Frontend</div>
              <div className="text-slate-300 text-sm">
                Vercel delivers your Next.js app globally with zero config
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-green-400">
                  ${costs.total.toFixed(2)}
                </div>
                <div className="text-slate-400 text-sm">
                  Current Monthly Cost
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400">
                  ${(costs.total * 12).toFixed(0)}
                </div>
                <div className="text-slate-400 text-sm">Annual Projection</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400">
                  ${(costs.total / orderVolume).toFixed(3)}
                </div>
                <div className="text-slate-400 text-sm">Cost Per Order</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">99.9%</div>
                <div className="text-slate-400 text-sm">Combined Uptime</div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Pricing current as of October 2025 • Visit official sites for
              latest pricing
            </p>
            <div className="mt-4 flex justify-center space-x-6">
              <a
                href="https://supabase.com/pricing"
                className="text-green-400 hover:text-green-300 text-sm"
              >
                Supabase
              </a>
              <a
                href="https://cloud.google.com/storage/pricing"
                className="text-red-400 hover:text-red-300 text-sm"
              >
                Google Cloud
              </a>
              <a
                href="https://vercel.com/pricing"
                className="text-slate-300 hover:text-white text-sm"
              >
                Vercel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WMSCostBreakdown;
