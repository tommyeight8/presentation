"use client";

import { useState } from "react";

export default function ScrollTest() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Remove horizontal padding on mobile */}
      <div className="mx-auto p-4 sm:p-4 px-0 sm:px-4">
        <h1 className="text-2xl font-bold mb-4 px-4 sm:px-0">
          Zebra TC22 Scroll Test
        </h1>

        {/* Method 1: Proper containment */}
        <div className="bg-white rounded-lg shadow mb-6 mx-4 sm:mx-0 overflow-hidden">
          <div className="border-b overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="flex">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveTab(`tab${num}`)}
                  className={`px-4 py-2 whitespace-nowrap text-sm flex-shrink-0 ${
                    activeTab === `tab${num}`
                      ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  Tab {num} Long Name
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm">Active: {activeTab}</p>
            <p className="text-xs text-gray-500 mt-2">
              Method 1: width: max-content with minWidth 100%
            </p>
          </div>
        </div>

        {/* Method 2: Full bleed container */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="inline-flex min-w-full px-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <button
                  key={num}
                  onClick={() => setActiveTab(`tab${num}`)}
                  className={`px-4 py-2 whitespace-nowrap text-sm flex-shrink-0 ${
                    activeTab === `tab${num}`
                      ? "border-b-2 border-green-600 text-green-600 font-medium"
                      : "text-gray-600"
                  }`}
                >
                  Tab {num} Long Name
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm">Active: {activeTab}</p>
            <p className="text-xs text-gray-500 mt-2">
              Method 2: Full bleed - inline-flex
            </p>
          </div>
        </div>

        {/* Method 3: Card with no side padding on header */}
        <div className="bg-white rounded-lg shadow mb-6 mx-4 sm:mx-0 overflow-hidden">
          <div className="overflow-hidden">
            <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
              <div
                className="flex px-4 border-b"
                style={{ width: "max-content", minWidth: "100%" }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <button
                    key={num}
                    onClick={() => setActiveTab(`tab${num}`)}
                    className={`py-2 px-2 whitespace-nowrap text-sm flex-shrink-0 ${
                      activeTab === `tab${num}`
                        ? "border-b-2 border-purple-600 text-purple-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    Tab {num} Long Name
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm">Active: {activeTab}</p>
            <p className="text-xs text-gray-500 mt-2">
              Method 3: Double overflow-hidden wrapper
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 mx-4 sm:mx-0">
          <h3 className="font-semibold text-sm mb-2">Test Results:</h3>
          <ul className="text-xs space-y-1">
            <li>✅ If tabs scroll inside the card = WORKING</li>
            <li>❌ If whole page scrolls horizontally = NOT WORKING</li>
            <li>📱 Test all three methods above</li>
          </ul>
        </div>

        {/* Device Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-4 sm:mx-0">
          <p className="text-xs font-mono">
            Screen: {typeof window !== "undefined" ? window.innerWidth : "N/A"}
            px
          </p>
          <p className="text-xs font-mono">Device: Zebra TC22</p>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

// "use client";

// import React, { useState } from "react";

// export default function BillsNav() {
//   const [activeBill, setActiveBill] = useState(1);

//   const bills = [
//     { id: 1, label: "INV-001" },
//     { id: 2, label: "INV-002" },
//     { id: 3, label: "INV-003" },
//     { id: 4, label: "INV-004" },
//     { id: 5, label: "INV-005" },
//   ];

//   return (
//     <div className="w-full bg-white border-b border-gray-200">
//       <style jsx>{`
//         .bills-nav::-webkit-scrollbar {
//           height: 8px;
//         }
//         .bills-nav::-webkit-scrollbar-track {
//           background: #f1f1f1;
//           border-radius: 4px;
//         }
//         .bills-nav::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 4px;
//         }
//         .bills-nav::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }
//       `}</style>
//       <div className="max-w-7xl mx-auto">
//         <div className="overflow-x-auto sm:mx-0">
//           <nav className="bills-nav flex gap-8 px-6 sm:px-0">
//             {bills.map((bill) => (
//               <button
//                 key={bill.id}
//                 onClick={() => setActiveBill(bill.id)}
//                 className={`
//                   relative py-4 px-1 text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0
//                   ${
//                     activeBill === bill.id
//                       ? "text-blue-600"
//                       : "text-gray-500 hover:text-gray-700"
//                   }
//                 `}
//               >
//                 {bill.label}
//                 {activeBill === bill.id && (
//                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
//                 )}
//               </button>
//             ))}
//           </nav>
//         </div>
//       </div>
//     </div>
//   );
// }
