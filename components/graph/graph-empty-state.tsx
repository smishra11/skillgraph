import { CheckCircle2, GitBranch, Route, Target } from 'lucide-react';

type GraphEmptyStateProps = {
  hasMissingSkills: boolean;
};

export function GraphEmptyState({ hasMissingSkills }: GraphEmptyStateProps) {
  return (
    <div className='relative overflow-hidden rounded-xl border border-zinc-200 bg-white px-4 py-7 text-center shadow-[0_10px_30px_-24px_rgba(24,24,27,0.35)] sm:rounded-2xl sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
      <div
        aria-hidden='true'
        className='absolute left-1/2 top-0 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50 blur-3xl sm:size-44'
      />

      <div className='relative'>
        <div className='mx-auto flex size-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 shadow-sm sm:size-11'>
          {hasMissingSkills ? (
            <GitBranch className='size-4.5 text-indigo-600 sm:size-5' />
          ) : (
            <Route className='size-4.5 text-indigo-600 sm:size-5' />
          )}
        </div>

        <h4 className='mt-3.5 text-sm font-semibold text-zinc-900 sm:mt-4'>
          {hasMissingSkills
            ? 'No learning path found from your selected skills'
            : 'No additional learning path needed'}
        </h4>

        <p className='mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-500'>
          {hasMissingSkills
            ? `SkillGraph couldn't find a prerequisite path from your current skills to the remaining requirements for this role. Try adding more skills you already know to discover additional paths.`
            : `You already cover all required skills for this role, so there are no missing requirements to map.`}
        </p>

        <div className='mt-4 flex flex-wrap items-center justify-center gap-2.5 text-[9px] font-medium text-zinc-400 sm:mt-5 sm:gap-3 sm:text-[10px]'>
          <span className='inline-flex items-center gap-1.5'>
            <CheckCircle2 className='size-3 text-emerald-500' />
            Known
          </span>

          <span className='inline-flex items-center gap-1.5'>
            <GitBranch className='size-3 text-indigo-500' />
            Prerequisites
          </span>

          <span className='inline-flex items-center gap-1.5'>
            <Target className='size-3 text-amber-500' />
            Target
          </span>
        </div>
      </div>
    </div>
  );
}
