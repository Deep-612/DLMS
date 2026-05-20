"use client"

import { useState } from "react"
import { Highlighter, Upload, ZoomIn, ZoomOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DocumentPreview() {
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(4)
  const totalPages = 12

  function zoomIn() { setZoom((z) => Math.min(z + 25, 200)) }
  function zoomOut() { setZoom((z) => Math.max(z - 25, 50)) }

  return (
    <div className="flex flex-col bg-white rounded-xl border border-slate-100 overflow-hidden h-full">
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
        <h2 className="text-base font-semibold text-slate-900">Document Preview</h2>
        <Button variant="outline" size="sm" className="gap-2 rounded-md border-slate-200 text-slate-700 text-xs h-8">
          <Upload className="h-3.5 w-3.5" />
          Upload Document
        </Button>
      </div>

      {/* Document body — internal scroll only */}
      <div className="flex-1 overflow-auto bg-slate-50 flex items-start justify-center p-6">
        <div
          className="bg-white shadow-sm border border-slate-100 rounded-sm p-10 w-full max-w-[520px] transition-transform origin-top"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
        >
          {/* Mock document content matching Figma */}
          <p className="text-right text-xs text-slate-400 mb-6">World Customs Journal</p>

          <h1 className="text-center text-lg font-bold text-slate-900 leading-snug mb-1">
            EU CUSTOMS LAW<br />AND INTERNATIONAL LAW
          </h1>
          <p className="text-center text-sm italic text-slate-700 mb-6">Michael Lux</p>

          <p className="text-xs text-slate-500 mb-3">
            The views expressed are those of the author and do not necessarily reflect the position of the institution in which he works.
          </p>
          <p className="text-xs text-slate-500 mb-6">
            An earlier version of this paper was presented at the conference on{" "}
            <em>Customs Law in the system of law</em>, held in Warsaw on{" "}
            <span className="text-amber-600 underline">11 December 2004</span>.
          </p>

          <h2 className="text-sm font-bold text-slate-900 mb-2">Abstract</h2>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            The interdependence between international law and European Community law, particularly in the area of customs, is very complex. The ways in which international customs law is incorporated into the Community's legal system are many and varied, and there is a need to establish some standard mechanisms for the future in order to reduce the diversity of solutions that are found for problems that are similar.
          </p>

          <h2 className="text-sm font-bold text-slate-900 mb-2">1. Introduction</h2>
          <h3 className="text-xs font-semibold text-slate-800 mb-1">
            1.1 The status of international agreements in the Community's legal order
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            According to Article 300 (7), European Community (EC) Treaty agreements concluded under the conditions set out in this Article are binding on the institutions of the Community and on Member States. This means that such agreements are an integral part of the Community's legal order and that they must therefore be respected by the institutions of the Community and the Member States.
          </p>

          <h3 className="text-xs font-semibold text-slate-800 mb-1">
            1.2 Interdependence between international and Community law in the customs area
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            Furthermore, certain agreements, by their nature or because of the intentions of the contracting parties, cannot, as such, become directly applicable in a country, or indeed a union of countries, but are designed to be implemented in, or taken into account, when drafting the national customs legislation.
          </p>

          <div className="border-t border-slate-100 pt-4 flex justify-between text-xs text-slate-400">
            <span>Volume 1, Number 1</span>
            <span>19</span>
          </div>
        </div>
      </div>

      {/* PDF Nav Bar — always visible at the bottom */}
      <div className="shrink-0 flex items-center justify-center py-4 bg-white border-t border-slate-100">
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-[0px_10px_40px_0px_rgba(0,0,0,0.12)]">
          {/* Zoom */}
          <div className="flex items-center gap-1">
            <button onClick={zoomIn} className="p-1 text-slate-600 hover:text-slate-900 transition-colors">
              <ZoomIn className="h-5 w-5" />
            </button>
            <span className="text-sm font-medium text-slate-700 w-12 text-center">{zoom}%</span>
            <button onClick={zoomOut} className="p-1 text-slate-600 hover:text-slate-900 transition-colors">
              <ZoomOut className="h-5 w-5" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200" />

          {/* Page */}
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <input
              type="number"
              value={page}
              min={1}
              max={totalPages}
              onChange={(e) => setPage(Math.min(Math.max(1, +e.target.value), totalPages))}
              className="w-8 h-7 text-center border border-slate-200 rounded-md text-sm font-medium text-slate-900 focus:outline-none"
            />
            <span className="text-slate-400">/</span>
            <span>{totalPages}</span>
          </div>

          <div className="h-5 w-px bg-slate-200" />

          {/* Highlighter */}
          <button className="p-1 text-amber-500 hover:text-amber-600 transition-colors">
            <Highlighter className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

  )
}
