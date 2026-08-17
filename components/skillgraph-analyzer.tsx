'use client';

import { useState } from 'react';

import {
  AnalysisResults,
  type SkillGapAnalysis,
} from '@/components/analysis-results';
import { AnalysisForm } from '@/components/analysis-form';

export function SkillGraphAnalyzer() {
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);

  return (
    <section className='py-16 lg:py-24'>
      <div className='grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'>
        <div className='max-w-2xl'>
          <div className='mb-5 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700'>
            Frontend career intelligence
          </div>

          <h1 className='text-4xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-5xl lg:text-6xl'>
            See the skills between you and your next role.
          </h1>

          <p className='mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg'>
            Compare your current frontend skills with your target role, uncover
            the gaps, and explore the learning paths connecting them.
          </p>

          <div className='mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500'>
            <span>Weighted skill matching</span>
            <span>Graph-based learning paths</span>
            <span>Interactive skill exploration</span>
          </div>
        </div>

        <AnalysisForm onAnalysisChange={setAnalysis} />
      </div>

      {analysis && (
        <div className='mt-12 border-t border-zinc-200 pt-10'>
          <AnalysisResults analysis={analysis} />
        </div>
      )}
    </section>
  );
}
