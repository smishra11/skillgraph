'use client';

import { useState } from 'react';

import {
  AnalysisForm,
  type SkillGraphResult,
} from '@/components/analysis-form';
import { AnalysisResults } from '@/components/analysis-results';
import { SkillGraph } from '@/components/graph/skill-graph';

export function SkillGraphAnalyzer() {
  const [result, setResult] = useState<SkillGraphResult | null>(null);

  const missingSkillSlugs =
    result?.analysis.missingSkills.map(({ skill }) => skill.slug) ?? [];

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

        <AnalysisForm onAnalysisChange={setResult} />
      </div>

      {result && (
        <div className='mt-12 space-y-6 border-t border-zinc-200 pt-10'>
          <AnalysisResults analysis={result.analysis} />

          {result.graphError ? (
            <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
              <p className='text-sm font-medium text-red-900'>
                Learning graph unavailable
              </p>

              <p className='mt-1 text-sm text-red-700'>{result.graphError}</p>
            </div>
          ) : (
            <SkillGraph
              key={`${result.analysis.role.slug}-${result.selectedSkillSlugs.join('-')}`}
              learningPaths={result.learningPaths}
              selectedSkillSlugs={result.selectedSkillSlugs}
              missingSkillSlugs={missingSkillSlugs}
            />
          )}
        </div>
      )}
    </section>
  );
}
