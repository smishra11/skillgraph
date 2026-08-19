'use client';

import type { SkillGapAnalysis } from '@/lib/db/queries';

import { RoleMatchSummary } from './role-match-summary';
import { SkillCoverage } from './skill-coverage';

type AnalysisResultsProps = {
  analysis: SkillGapAnalysis;
};

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  return (
    <div>
      <RoleMatchSummary analysis={analysis} />

      <SkillCoverage
        matchedSkills={analysis.matchedSkills}
        missingSkills={analysis.missingSkills}
      />
    </div>
  );
}
