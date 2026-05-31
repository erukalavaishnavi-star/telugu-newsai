'use client';

import Link from 'next/link';
import Navbar from '@/components/shared/Navbar';
import AuthGuard from '@/components/shared/AuthGuard';

const DOCS = [
  { title: 'Product Requirements (PRD)', file: 'docs/PRD.md', desc: 'Goals, users, features, success metrics' },
  { title: 'Software Requirements (SRS)', file: 'docs/SRS.md', desc: 'Functional & non-functional requirements' },
  { title: 'API Design', file: 'docs/API.md', desc: 'REST endpoints, auth, payloads' },
  { title: 'UI/UX Design', file: 'docs/UI-UX.md', desc: 'Layout, colors, flows, components' },
  { title: 'Deployment Guide', file: 'DEPLOYMENT.md', desc: 'Vercel + Railway setup' },
  { title: 'Screenshots Guide', file: 'docs/SCREENSHOTS.md', desc: 'Portfolio screenshot descriptions' },
  { title: 'Resume Description', file: 'docs/RESUME.md', desc: 'ATS-friendly project blurb' },
];

function DocsContent() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="font-head font-extrabold text-2xl text-slate-900 mb-2">Project documentation</h1>
        <p className="text-sm text-slate-500 mb-8">
          Full documentation ships with the repository under <code className="text-xs bg-slate-100 px-1 rounded">telugu-newsai/</code>.
        </p>
        <div className="space-y-3">
          {DOCS.map((doc) => (
            <div key={doc.file} className="card p-4">
              <h2 className="font-head font-bold text-slate-900">{doc.title}</h2>
              <p className="text-sm text-slate-500 mt-1">{doc.desc}</p>
              <p className="text-xs font-mono text-blue-600 mt-2">{doc.file}</p>
            </div>
          ))}
        </div>
        <Link href="/dashboard" className="inline-block mt-6 text-sm text-red-600 hover:underline">
          ← Back to dashboard
        </Link>
      </main>
    </div>
  );
}

export default function DocsPage() {
  return (
    <AuthGuard>
      <DocsContent />
    </AuthGuard>
  );
}
