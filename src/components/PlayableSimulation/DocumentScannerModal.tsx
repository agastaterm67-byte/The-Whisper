/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArchiveDocument } from '../../types/game';
import { INITIAL_ARCHIVE_DOCUMENTS } from '../../data/archiveLore';
import { FileText, CheckCircle2, X, Archive, Lock } from 'lucide-react';

interface DocumentScannerModalProps {
  documents: ArchiveDocument[];
  onSortDocument: (docId: string) => void;
  onClose: () => void;
}

export const DocumentScannerModal: React.FC<DocumentScannerModalProps> = ({
  documents,
  onSortDocument,
  onClose
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const activeDoc = documents.find(d => d.id === selectedDocId) || documents[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-3xl bg-[#0f1117] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#141720]">
          <div className="flex items-center gap-3">
            <Archive className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-bold font-mono-code text-zinc-100 uppercase tracking-wide">
                Blackwood Historical Archives · Microfilm Reader Terminal
              </h2>
              <div className="text-[11px] text-zinc-400">
                Night Shift Directive: Classify and catalog asylum records before 04:00 AM
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content split: Document List & Document Viewer */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Document File Index */}
          <div className="border-r border-zinc-800 p-4 space-y-2 overflow-y-auto bg-[#0c0e14]">
            <div className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-500 mb-2">
              Unprocessed Case Files
            </div>
            {documents.map(doc => {
              const isSelected = doc.id === activeDoc?.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-zinc-800/90 border-amber-500/60 shadow-md'
                      : 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono-code mb-1">
                    <span className="text-amber-400 font-bold">{doc.id}</span>
                    {doc.isSorted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className="text-[9px] text-zinc-500">PENDING</span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-zinc-200 line-clamp-1">
                    {doc.title}
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    {doc.date}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Microfilm Case File Reader */}
          <div className="col-span-2 p-6 overflow-y-auto flex flex-col justify-between bg-[#12141c]">
            {activeDoc ? (
              <div className="space-y-4">
                {/* Vintage Document Header */}
                <div className="p-4 bg-[#181a24] border border-amber-950/40 rounded-lg">
                  <div className="flex items-center justify-between text-[11px] font-mono-code text-zinc-400 mb-2">
                    <span className="text-red-400 font-bold">{activeDoc.classification}</span>
                    <span>ST. JUDE COLONIAL ASYLUM ARCHIVES</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 font-cinzel">
                    {activeDoc.title}
                  </h3>
                  <div className="text-xs text-amber-500 font-mono-code mt-0.5">
                    Filed: {activeDoc.date} · Location: {activeDoc.location}
                  </div>
                </div>

                {/* Document Body / Transcript */}
                <div className="p-5 bg-[#0e1017] border border-zinc-800 rounded-lg text-sm text-zinc-300 font-mono-code leading-relaxed whitespace-pre-line shadow-inner">
                  {activeDoc.content}
                </div>
              </div>
            ) : null}

            {/* Action Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <div className="text-xs text-zinc-400 font-mono-code">
                {activeDoc?.isSorted ? (
                  <span className="text-emerald-400 font-bold">✓ RECORD CATALOGED & RESTORED</span>
                ) : (
                  <span>Click below to complete cataloging this file.</span>
                )}
              </div>

              {activeDoc && !activeDoc.isSorted ? (
                <button
                  onClick={() => onSortDocument(activeDoc.id)}
                  className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-mono-code text-xs font-bold uppercase transition-colors shadow-lg shadow-amber-900/30"
                >
                  File & Archive Record
                </button>
              ) : (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-lg bg-zinc-800 text-zinc-500 font-mono-code text-xs uppercase cursor-not-allowed"
                >
                  Cataloged
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
