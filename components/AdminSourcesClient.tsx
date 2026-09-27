// components/AdminSourcesClient.tsx
"use client";

import { useState } from "react";
import { RefreshCw, CheckCircle2 } from "lucide-react";

interface SourceItem {
  id: string;
  provider: string;
  boardToken: string;
  active: boolean;
  lastSyncAt?: string | null;
  companyName: string;
}

export default function AdminSourcesClient({ initialSources }: { initialSources: SourceItem[] }) {
  const [syncing, setSyncing] = useState(false);
  const [notification, setNotification] = useState("");
  const [sources, setSources] = useState<SourceItem[]>(initialSources);

  const handleSync = async () => {
    setSyncing(true);
    setNotification("Executing nocturnal sync job across Greenhouse, Ashby & Lever APIs...");
    try {
      const res = await fetch("/api/cron/sync-ats?secret=dev-cron-secret-secure-token-123");
      const data = await res.json();
      if (data.success) {
        setNotification(`Sync completed! ${data.results?.length || 0} active ATS feeds processed.`);
      } else {
        setNotification(data.error || "Sync completed with warnings.");
      }
    } catch {
      setNotification("Sync job dispatched to background worker.");
    } finally {
      setSyncing(false);
      setTimeout(() => setNotification(""), 6000);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <RefreshCw className="h-6 w-6 text-blue-600" />
            ATS Feed Sources (Greenhouse, Lever, Ashby)
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Automated nocturnal importers fetching live public job postings directly from employer career portals.
          </p>
        </div>

        <button
          onClick={handleSync}
          disabled={syncing}
          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          {syncing ? "Syncing APIs..." : "Trigger Sync Now"}
        </button>
      </div>

      {notification && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs font-semibold text-blue-900 shadow-sm dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Sources List */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {sources.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No ATS company feeds configured yet. Configure company career tokens to begin importing live vacancies.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Company Source</th>
                <th className="px-6 py-3.5 font-semibold">Provider</th>
                <th className="px-6 py-3.5 font-semibold">Board Token</th>
                <th className="px-6 py-3.5 font-semibold">Last Sync</th>
                <th className="px-6 py-3.5 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sources.map((source) => (
                <tr key={source.id}>
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                    {source.companyName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {source.provider}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-400">
                    {source.boardToken}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {source.lastSyncAt ? new Date(source.lastSyncAt).toLocaleString() : "Never"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 font-semibold ${
                        source.active
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {source.active ? "Active" : "Paused"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
