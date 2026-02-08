"use client";

import { useEffect, useState } from "react";

type Summary = any;

export default function ReportsPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/reports/summary.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return (<div className="p-8"><h2 className="text-xl font-semibold">Reports</h2><p className="text-red-600">Failed to load: {error}</p></div>);
  if (!data) return (<div className="p-8">Loading reports...</div>);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Marketplace Reports (Public)</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Orphan checks</h2>
        <ul className="list-disc pl-6">
          <li>orphan_reviews: {data.orphan_checks.orphan_reviews}</li>
          <li>orphan_time_entries: {data.orphan_checks.orphan_time_entries}</li>
          <li>orphan_job_applications: {data.orphan_checks.orphan_job_applications}</li>
          <li>orphan_portfolio_items: {data.orphan_checks.orphan_portfolio_items}</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Top companies by jobs_posted</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="border-b pb-2">Company</th>
              <th className="border-b pb-2">Jobs Posted</th>
            </tr>
          </thead>
          <tbody>
            {data.top_companies_by_jobs_posted.map((c: any) => (
              <tr key={c.company}>
                <td className="py-2">{c.company}</td>
                <td className="py-2">{c.jobs_posted}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Top freelancers by contracts</h2>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left">
              <th className="border-b pb-2">Freelancer</th>
              <th className="border-b pb-2">Contracts</th>
              <th className="border-b pb-2">Total Paid</th>
            </tr>
          </thead>
          <tbody>
            {data.top_freelancers_by_contracts_count.map((f: any) => (
              <tr key={f.username}>
                <td className="py-2">{f.username}</td>
                <td className="py-2">{f.contracts}</td>
                <td className="py-2">${(f.total_paid).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Jobs by category (top)</h2>
        <ul className="list-disc pl-6">
          {data.jobs_by_category.map((j: any) => <li key={j.category}>{j.category} — {j.count}</li>)}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Contracts by status</h2>
        <ul className="list-disc pl-6">
          {Object.entries(data.contracts_by_status).map(([k,v]: [string, unknown]) => <li key={k}>{k}: {String(v)}</li>)}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Freelancers with zero portfolio (sample)</h2>
        <p>{data.freelancers_with_zero_portfolio_sample.join(', ')}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">Samples</h2>
        <p>{data.sample_recent_reviews}</p>
        <p>{data.sample_recent_time_entries}</p>
        <p>{data.sample_recent_job_applications}</p>
      </section>

      <footer className="text-sm text-gray-500 mt-8">This page is public and static; to update the data, replace <code>/public/reports/summary.json</code> with a new JSON export.</footer>
    </div>
  );
}
