'use client';

import { useState } from 'react';

import type { LearningPath, SkillGapAnalysis } from '@/lib/db/queries';

import { AnalysisWorkspace } from './analyzer/analysis-workspace';
import { AnalyzerHero } from './analyzer/analyzer-hero';
import { ProfilePanel } from './analyzer/profile-panel';
import { WorkspaceEmptyState } from './analyzer/workspace-empty-state';

type SkillGraphResult = {
  analysis: SkillGapAnalysis;
  learningPaths: LearningPath[];
  selectedSkillSlugs: string[];
  graphError: string;
};

export default function SkillGraphAnalyzer() {
  const [result, setResult] = useState<SkillGraphResult | null>(null);

  const missingSkillSlugs =
    result?.analysis.missingSkills.map(({ skill }) => skill.slug) ?? [];

  return (
    <>
      <AnalyzerHero />

      <section className='pb-8 sm:pb-12 lg:pb-14'>
        <div className='overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_24px_70px_-36px_rgba(24,24,27,0.38)] sm:rounded-[24px]'>
          <div className='grid min-h-170 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[370px_minmax(0,1fr)]'>
            <ProfilePanel onAnalysisChange={setResult} />

            <div className='min-w-0 bg-white'>
              {result ? (
                <AnalysisWorkspace
                  result={result}
                  missingSkillSlugs={missingSkillSlugs}
                />
              ) : (
                <WorkspaceEmptyState />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
