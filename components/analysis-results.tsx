'use client';

import {
  Award,
  Check,
  CheckCircle2,
  CircleAlert,
  Gauge,
  Target,
  TrendingUp,
} from 'lucide-react';

import type { SkillGapAnalysis, SkillGapItem } from '@/lib/db/queries';

type AnalysisResultsProps = {
  analysis: SkillGapAnalysis;
};

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const {
    role,
    matchPercentage,
    matchedWeight,
    totalWeight,
    matchedSkills,
    missingSkills,
  } = analysis;

  const totalRequirements = matchedSkills.length + missingSkills.length;

  const coveredRequirements = matchedSkills.length;

  const isFullyCovered = missingSkills.length === 0;

  const scoreLabel = getScoreLabel(matchPercentage);

  return (
    <div>
      {/* Role overview */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5'>
        <div className='min-w-0'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700'>
              <Target className='size-3' />
              Target role
            </span>

            <span className='rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500'>
              {role.level}
            </span>
          </div>

          <h2 className='mt-3 text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl lg:text-[1.7rem]'>
            {role.name}
          </h2>

          <p className='mt-1.5 max-w-2xl text-sm leading-6 text-zinc-500 sm:mt-2'>
            {role.description}
          </p>
        </div>

        <div className='shrink-0'>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold sm:px-3 sm:text-xs ${
              isFullyCovered
                ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                : 'border-indigo-100 bg-indigo-50 text-indigo-700'
            }`}
          >
            {isFullyCovered ? (
              <CheckCircle2 className='size-3.5' />
            ) : (
              <TrendingUp className='size-3.5' />
            )}

            {isFullyCovered ? 'All requirements covered' : scoreLabel}
          </span>
        </div>
      </div>

      {/* Score section */}
      <div className='mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50/60 sm:mt-7 sm:rounded-2xl'>
        <div className='grid lg:grid-cols-[1.25fr_0.75fr]'>
          {/* Match score */}
          <div className='border-b border-zinc-200 p-4 sm:p-5 lg:border-r lg:border-b-0'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <div className='flex items-center gap-2'>
                  <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50'>
                    <Gauge className='size-4 text-indigo-600' />
                  </div>

                  <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:text-xs'>
                    Role match
                  </p>
                </div>

                <div className='mt-4 flex items-end gap-2 sm:mt-5'>
                  <span className='text-5xl font-semibold tracking-[-0.055em] text-zinc-950 sm:text-6xl'>
                    {matchPercentage}
                  </span>

                  <span className='mb-1.5 text-lg font-medium text-zinc-400 sm:text-xl'>
                    %
                  </span>
                </div>

                <p className='mt-1.5 text-sm leading-5 text-zinc-500 sm:mt-2'>
                  Weighted readiness for this role
                </p>
              </div>

              <div className='hidden size-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-white shadow-[0_10px_25px_-16px_rgba(79,70,229,0.35)] sm:flex lg:size-14'>
                <Award className='size-5 text-indigo-600 lg:size-6' />
              </div>
            </div>

            {/* Progress */}
            <div className='mt-5 sm:mt-6'>
              <div className='h-2 overflow-hidden rounded-full bg-zinc-200/80 sm:h-2.5'>
                <div
                  className='h-full rounded-full bg-linear-to-r from-indigo-500 to-violet-500 transition-[width] duration-700 ease-out'
                  style={{
                    width: `${Math.min(Math.max(matchPercentage, 0), 100)}%`,
                  }}
                />
              </div>

              <div className='mt-2 flex items-center justify-between gap-2 text-[10px] text-zinc-400 sm:text-[11px]'>
                <span className='shrink-0'>0%</span>

                <span className='min-w-0 truncate text-center font-medium text-zinc-500'>
                  {matchedWeight} / {totalWeight} weighted points
                </span>

                <span className='shrink-0'>100%</span>
              </div>
            </div>
          </div>

          {/* Requirement coverage */}
          <div className='p-4 sm:p-5'>
            <div className='flex items-center gap-2'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50'>
                <CheckCircle2 className='size-4 text-emerald-600' />
              </div>

              <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 sm:text-xs'>
                Requirement coverage
              </p>
            </div>

            <div className='mt-4 flex items-end gap-2 sm:mt-5'>
              <span className='text-4xl font-semibold tracking-[-0.045em] text-zinc-950'>
                {coveredRequirements}
              </span>

              <span className='mb-1 text-sm font-medium text-zinc-400'>
                of {totalRequirements}
              </span>
            </div>

            <p className='mt-1.5 text-sm leading-5 text-zinc-500 sm:mt-2'>
              Required skills already covered
            </p>

            <div className='mt-4 flex flex-wrap gap-2 sm:mt-5'>
              <span className='inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 sm:text-[11px]'>
                <Check className='size-3' />
                {matchedSkills.length} matched
              </span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold sm:text-[11px] ${
                  isFullyCovered
                    ? 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border-amber-100 bg-amber-50 text-amber-700'
                }`}
              >
                {isFullyCovered ? (
                  <CheckCircle2 className='size-3' />
                ) : (
                  <CircleAlert className='size-3' />
                )}

                {isFullyCovered
                  ? 'All covered'
                  : `${missingSkills.length} missing`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Skill coverage */}
      <div className='mt-7 sm:mt-8'>
        <div>
          <p className='text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-400 sm:text-xs'>
            Skill coverage
          </p>

          <h3 className='mt-1.5 text-base font-semibold tracking-tight text-zinc-950 sm:text-lg'>
            How your skills compare
          </h3>

          <p className='mt-1 text-sm leading-6 text-zinc-500'>
            Required skills are grouped by what you already cover and what you
            still need to develop.
          </p>
        </div>

        <div className='mt-4 grid gap-3 sm:mt-5 sm:gap-4 lg:grid-cols-2'>
          <SkillCoverageSection
            type='matched'
            title='Skills you already have'
            description='Requirements already covered by your selected skills.'
            items={matchedSkills}
          />

          <SkillCoverageSection
            type='missing'
            title='Skills to develop'
            description='Requirements still missing for your target role.'
            items={missingSkills}
          />
        </div>
      </div>
    </div>
  );
}

type SkillCoverageSectionProps = {
  type: 'matched' | 'missing';
  title: string;
  description: string;
  items: SkillGapItem[];
};

function SkillCoverageSection({
  type,
  title,
  description,
  items,
}: SkillCoverageSectionProps) {
  const isMatched = type === 'matched';

  return (
    <section className='overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_10px_28px_-22px_rgba(24,24,27,0.35)] sm:rounded-2xl'>
      {/* Header */}
      <div className='border-b border-zinc-100 px-3.5 py-3.5 sm:px-4 sm:py-4'>
        <div className='flex items-start gap-2.5 sm:gap-3'>
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg border sm:size-9 sm:rounded-xl ${
              isMatched
                ? 'border-emerald-100 bg-emerald-50'
                : 'border-amber-100 bg-amber-50'
            }`}
          >
            {isMatched ? (
              <CheckCircle2 className='size-4 text-emerald-600' />
            ) : (
              <Target className='size-4 text-amber-600' />
            )}
          </div>

          <div className='min-w-0'>
            <div className='flex flex-wrap items-center gap-2'>
              <h4 className='text-sm font-semibold text-zinc-900'>{title}</h4>

              {items.length > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isMatched
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {items.length}
                </span>
              )}
            </div>

            <p className='mt-1 text-xs leading-5 text-zinc-500'>
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-3.5 sm:p-4'>
        {items.length > 0 ? (
          <div className='space-y-2'>
            {items.map(({ skill, importance }) => (
              <div
                key={skill.id}
                className={`group flex items-center justify-between gap-2.5 rounded-lg border px-3 py-2.5 transition-all duration-200 sm:gap-3 sm:rounded-xl sm:px-3.5 sm:py-3 ${
                  isMatched
                    ? 'border-emerald-100/80 bg-emerald-50/40 hover:border-emerald-200 hover:bg-emerald-50/70'
                    : 'border-amber-100/80 bg-amber-50/40 hover:border-amber-200 hover:bg-amber-50/70'
                }`}
              >
                <div className='flex min-w-0 items-center gap-2.5 sm:gap-3'>
                  <span
                    className={`size-2 shrink-0 rounded-full ${
                      isMatched ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />

                  <div className='min-w-0'>
                    <p className='truncate text-sm font-semibold text-zinc-800'>
                      {skill.name}
                    </p>

                    <div className='mt-0.5 flex min-w-0 items-center gap-1.5 text-[10px] text-zinc-500 sm:text-[11px]'>
                      <span className='truncate'>{skill.category}</span>

                      <span className='shrink-0 text-zinc-300'>•</span>

                      <span className='shrink-0 capitalize'>{skill.level}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full border bg-white px-1.5 py-1 text-[9px] font-semibold sm:px-2 sm:text-[10px] ${
                    importance === 5
                      ? 'border-indigo-100 text-indigo-700'
                      : 'border-zinc-200 text-zinc-500'
                  }`}
                >
                  {getImportanceLabel(importance)}
                </span>
              </div>
            ))}
          </div>
        ) : isMatched ? (
          <div className='rounded-lg border border-dashed border-zinc-200 bg-zinc-50/60 p-3.5 sm:rounded-xl sm:p-4'>
            <p className='text-sm font-semibold text-zinc-700'>
              No matching skills yet
            </p>

            <p className='mt-1 text-xs leading-5 text-zinc-500'>
              None of your selected skills currently match this role&apos;s
              requirements.
            </p>
          </div>
        ) : (
          <div className='rounded-lg border border-dashed border-emerald-200 bg-emerald-50/60 p-3.5 sm:rounded-xl sm:p-4'>
            <div className='flex items-start gap-2.5 sm:gap-3'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm'>
                <CheckCircle2 className='size-4 text-emerald-600' />
              </div>

              <div className='min-w-0'>
                <p className='text-sm font-semibold text-emerald-800'>
                  You&apos;ve covered all required skills
                </p>

                <p className='mt-1 text-xs leading-5 text-emerald-700'>
                  Your selected skills satisfy all requirements for this role.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function getImportanceLabel(importance: number) {
  if (importance === 5) {
    return 'Core';
  }

  if (importance === 4) {
    return 'Important';
  }

  return 'Recommended';
}

function getScoreLabel(matchPercentage: number) {
  if (matchPercentage >= 90) {
    return 'Excellent match';
  }

  if (matchPercentage >= 75) {
    return 'Strong match';
  }

  if (matchPercentage >= 50) {
    return 'Good foundation';
  }

  return 'Growth opportunity';
}
