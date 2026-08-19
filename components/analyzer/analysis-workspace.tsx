import type { ReactNode } from 'react';
import { GitBranch, Target, type LucideIcon } from 'lucide-react';
import type { LearningPath, SkillGapAnalysis } from '@/lib/db/queries';
import { SkillGraph } from '../graph/skill-graph';
import { AnalysisResults } from '../analysis/analysis-results';

type AnalysisWorkspaceResult = {
  analysis: SkillGapAnalysis;
  learningPaths: LearningPath[];
  selectedSkillSlugs: string[];
  graphError: string;
};

type AnalysisWorkspaceProps = {
  result: AnalysisWorkspaceResult;
  missingSkillSlugs: string[];
};

export function AnalysisWorkspace({
  result,
  missingSkillSlugs,
}: AnalysisWorkspaceProps) {
  return (
    <div className='animate-in fade-in duration-300'>
      {/* Results header */}
      <div className='flex flex-col gap-3 border-b border-zinc-100 bg-linear-to-r from-white via-white to-indigo-50/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-5 lg:px-7'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-600'>
              Career readiness
            </span>

            <span className='size-1 shrink-0 rounded-full bg-zinc-300' />

            <span className='text-[11px] font-medium text-zinc-400'>
              Analysis complete
            </span>
          </div>

          <p className='mt-1.5 text-sm leading-5 text-zinc-500'>
            Your readiness analysis and graph-derived learning path.
          </p>
        </div>

        <div className='inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-[0_5px_14px_-10px_rgba(5,150,105,0.35)]'>
          <span className='relative flex size-1.5 shrink-0'>
            <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50' />

            <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
          </span>
          Live analysis
        </div>
      </div>

      {/* Analysis results */}
      <div className='px-4 py-5 sm:px-6 sm:py-6 lg:px-7'>
        <AnalysisResults analysis={result.analysis} />
      </div>

      {/* Learning graph */}
      <div className='border-t border-zinc-100 bg-zinc-50/20'>
        <div className='flex flex-col gap-4 px-4 pb-4 pt-5 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pt-6 lg:px-7'>
          <div className='min-w-0'>
            <div className='flex items-center gap-2.5'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 shadow-sm'>
                <GitBranch className='size-4 text-indigo-600' />
              </div>

              <p className='text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600'>
                Learning graph
              </p>
            </div>

            <h3 className='mt-3 text-lg font-semibold tracking-tight text-zinc-950 sm:text-xl'>
              Explore your path forward
            </h3>

            <p className='mt-1 max-w-xl text-sm leading-6 text-zinc-500'>
              Follow prerequisite relationships from skills you already know
              toward missing requirements.
            </p>
          </div>

          {result.learningPaths.length > 0 && (
            <div className='flex flex-wrap items-center gap-2 text-xs text-zinc-500'>
              <GraphStatBadge icon={GitBranch}>
                {result.learningPaths.length}{' '}
                {result.learningPaths.length === 1 ? 'path' : 'paths'}
              </GraphStatBadge>

              <GraphStatBadge icon={Target}>
                {missingSkillSlugs.length}{' '}
                {missingSkillSlugs.length === 1 ? 'gap' : 'gaps'}
              </GraphStatBadge>
            </div>
          )}
        </div>

        <div className='px-4 pb-5 sm:px-6 sm:pb-6 lg:px-7 lg:pb-7'>
          {result.graphError ? (
            <div className='rounded-xl border border-red-200 bg-red-50 p-3.5 shadow-sm sm:p-4'>
              <p className='text-sm font-medium text-red-800'>
                Unable to load the learning graph
              </p>

              <p className='mt-1 text-xs leading-5 text-red-600'>
                {result.graphError}
              </p>
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
      </div>
    </div>
  );
}

type GraphStatBadgeProps = {
  icon: LucideIcon;
  children: ReactNode;
};

function GraphStatBadge({ icon: Icon, children }: GraphStatBadgeProps) {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-medium whitespace-nowrap text-zinc-500 shadow-sm'>
      <Icon className='size-3' />
      {children}
    </span>
  );
}
