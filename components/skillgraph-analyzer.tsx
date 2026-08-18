'use client';

import { useState, type ComponentType, type ReactNode } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  Network,
  Route,
  Sparkles,
  Target,
} from 'lucide-react';

import type { LearningPath, SkillGapAnalysis } from '@/lib/db/queries';

import { AnalysisForm } from './analysis-form';
import { AnalysisResults } from './analysis-results';
import { SkillGraph } from './graph/skill-graph';

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
      {/* HERO */}
      <section className='pb-10 pt-12 sm:pb-12 sm:pt-16 lg:pb-14 lg:pt-20'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-3.5 py-1.5 text-xs font-medium text-indigo-700 shadow-[0_6px_18px_-10px_rgba(79,70,229,0.40)] backdrop-blur-sm'>
            <Sparkles aria-hidden='true' className='size-3.5' />
            Graph-powered frontend career intelligence
          </div>

          <h1 className='mx-auto mt-6 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl sm:leading-[1.12] lg:text-[3.4rem] lg:leading-[1.08]'>
            Understand the path between{' '}
            <span className='relative whitespace-nowrap text-indigo-600'>
              where you are
              <span
                aria-hidden='true'
                className='absolute inset-x-0 -bottom-1 h-1.25 rounded-full bg-indigo-100'
              />
            </span>{' '}
            and your next frontend role.
          </h1>

          <p className='mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base sm:leading-7'>
            Compare your current skill set against weighted role requirements,
            identify meaningful gaps, and explore the prerequisite paths that
            can help you close them.
          </p>

          <div className='mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-x-4'>
            <HeroFeature
              icon={CheckCircle2}
              label='Weighted skill matching'
              iconClassName='text-emerald-600'
            />

            <HeroFeature
              icon={Target}
              label='Role gap analysis'
              iconClassName='text-indigo-600'
            />

            <HeroFeature
              icon={GitBranch}
              label='Multi-hop learning paths'
              iconClassName='text-violet-600'
            />
          </div>
        </div>
      </section>

      {/* APPLICATION WORKSPACE */}
      <section className='pb-10 sm:pb-14'>
        <div className='overflow-hidden rounded-[24px] border border-zinc-200/90 bg-white shadow-[0_24px_70px_-36px_rgba(24,24,27,0.38)]'>
          <div className='grid min-h-170 lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[370px_minmax(0,1fr)]'>
            {/* LEFT CONTROL PANEL */}
            <aside className='relative border-b border-zinc-200 bg-zinc-50/75 lg:border-r lg:border-b-0'>
              <div className='lg:sticky lg:top-6'>
                <div className='p-5 sm:p-6 lg:p-7'>
                  {/* Panel introduction */}
                  <div className='mb-6'>
                    <div className='flex items-center gap-2.5'>
                      <div className='flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-[0_5px_14px_-9px_rgba(24,24,27,0.35)]'>
                        <Target className='size-4 text-indigo-600' />
                      </div>

                      <span className='text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500'>
                        Your profile
                      </span>
                    </div>

                    <h2 className='mt-4 text-xl font-semibold tracking-tight text-zinc-950'>
                      Where are you today?
                    </h2>

                    <p className='mt-2 text-sm leading-6 text-zinc-500'>
                      Select your current skills and the role you want to
                      evaluate.
                    </p>
                  </div>

                  {/* Form */}
                  <div className='rounded-2xl border border-indigo-100 bg-white p-4 shadow-[0_14px_34px_-22px_rgba(79,70,229,0.32)] sm:p-5'>
                    <div className='mb-4 flex items-center justify-between gap-3'>
                      <div>
                        <p className='text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-600'>
                          Build your profile
                        </p>

                        <p className='mt-1 text-xs leading-5 text-zinc-500'>
                          Choose your skills and target role below.
                        </p>
                      </div>

                      <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50'>
                        <Sparkles className='size-3.5 text-indigo-600' />
                      </div>
                    </div>

                    <AnalysisForm onAnalysisChange={setResult} />
                  </div>

                  {/* How it works */}
                  <div className='mt-7 border-t border-zinc-200 pt-6'>
                    <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400'>
                      How SkillGraph works
                    </p>

                    <div className='mt-5 space-y-5'>
                      <HowItWorksItem
                        number='01'
                        icon={Target}
                        title='Compare'
                        description='Measure your skills against weighted requirements for the target role.'
                      />

                      <HowItWorksItem
                        number='02'
                        icon={CheckCircle2}
                        title='Identify'
                        description='Separate the requirements you already cover from the skills still missing.'
                      />

                      <HowItWorksItem
                        number='03'
                        icon={Route}
                        title='Navigate'
                        description='Traverse prerequisite relationships to discover useful learning paths.'
                      />
                    </div>
                  </div>

                  {/* Graph database explanation */}
                  <div className='mt-7 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4 shadow-[0_8px_24px_-18px_rgba(79,70,229,0.35)]'>
                    <div className='flex items-start gap-3'>
                      <div className='flex size-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm'>
                        <Network className='size-3.5 text-indigo-600' />
                      </div>

                      <p className='pt-0.5 text-xs leading-5 text-indigo-950/70'>
                        Recommendations are generated from relationships between
                        roles, required skills, and prerequisite skills stored
                        in CognoDB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* RIGHT WORKSPACE */}
            <div className='min-w-0 bg-white'>
              {result ? (
                <div className='animate-in fade-in duration-300'>
                  {/* Results header */}
                  <div className='flex flex-col gap-4 border-b border-zinc-100 bg-linear-to-r from-white via-white to-indigo-50/30 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-8'>
                    <div>
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-600'>
                          Career readiness
                        </span>

                        <span className='size-1 rounded-full bg-zinc-300' />

                        <span className='text-[11px] font-medium text-zinc-400'>
                          Analysis complete
                        </span>
                      </div>

                      <p className='mt-1.5 text-sm text-zinc-500'>
                        Your readiness analysis and graph-derived learning path.
                      </p>
                    </div>

                    <div className='inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 shadow-[0_5px_14px_-10px_rgba(5,150,105,0.35)]'>
                      <span className='relative flex size-1.5'>
                        <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-50' />

                        <span className='relative inline-flex size-1.5 rounded-full bg-emerald-500' />
                      </span>
                      Live analysis
                    </div>
                  </div>

                  {/* ANALYSIS RESULTS */}
                  <div className='px-5 py-6 sm:px-7 lg:px-8 lg:py-7'>
                    <AnalysisResults analysis={result.analysis} />
                  </div>

                  {/* LEARNING GRAPH */}
                  <div className='border-t border-zinc-100 bg-zinc-50/20'>
                    <div className='flex flex-col gap-4 px-5 pb-4 pt-6 sm:flex-row sm:items-end sm:justify-between sm:px-7 lg:px-8 lg:pt-7'>
                      <div>
                        <div className='flex items-center gap-2.5'>
                          <div className='flex size-8 items-center justify-center rounded-lg border border-indigo-100 bg-indigo-50 shadow-sm'>
                            <GitBranch className='size-4 text-indigo-600' />
                          </div>

                          <p className='text-xs font-semibold uppercase tracking-[0.14em] text-indigo-600'>
                            Learning graph
                          </p>
                        </div>

                        <h3 className='mt-3 text-xl font-semibold tracking-tight text-zinc-950'>
                          Explore your path forward
                        </h3>

                        <p className='mt-1 max-w-xl text-sm leading-6 text-zinc-500'>
                          Follow prerequisite relationships from skills you
                          already know toward missing requirements.
                        </p>
                      </div>

                      {result.learningPaths.length > 0 && (
                        <div className='flex items-center gap-2 text-xs text-zinc-500'>
                          <GraphStatBadge>
                            <GitBranch className='size-3' />
                            {result.learningPaths.length}{' '}
                            {result.learningPaths.length === 1
                              ? 'path'
                              : 'paths'}
                          </GraphStatBadge>

                          <GraphStatBadge>
                            <Target className='size-3' />
                            {missingSkillSlugs.length}{' '}
                            {missingSkillSlugs.length === 1 ? 'gap' : 'gaps'}
                          </GraphStatBadge>
                        </div>
                      )}
                    </div>

                    <div className='px-5 pb-6 sm:px-7 lg:px-8 lg:pb-8'>
                      {result.graphError ? (
                        <div className='rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm'>
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

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

type HeroFeatureProps = {
  icon: ComponentType<{
    className?: string;
  }>;
  label: string;
  iconClassName: string;
};

function HeroFeature({ icon: Icon, label, iconClassName }: HeroFeatureProps) {
  return (
    <div className='inline-flex items-center gap-2 rounded-full border border-zinc-200/90 bg-white/75 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-[0_5px_16px_-12px_rgba(24,24,27,0.3)] backdrop-blur-sm sm:text-sm'>
      <Icon className={`size-3.5 sm:size-4 ${iconClassName}`} />

      {label}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* How SkillGraph works                                                       */
/* -------------------------------------------------------------------------- */

type HowItWorksItemProps = {
  number: string;
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
};

function HowItWorksItem({
  number,
  icon: Icon,
  title,
  description,
}: HowItWorksItemProps) {
  return (
    <div className='group flex gap-3'>
      <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-[0_5px_14px_-10px_rgba(24,24,27,0.35)] transition-all duration-200 group-hover:border-indigo-200 group-hover:bg-indigo-50 group-hover:shadow-[0_6px_16px_-10px_rgba(79,70,229,0.35)]'>
        <Icon className='size-3.5 text-zinc-600 transition-colors group-hover:text-indigo-600' />
      </div>

      <div className='min-w-0 pt-0.5'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-semibold text-zinc-800'>{title}</p>

          <span className='font-mono text-[10px] text-zinc-400'>{number}</span>
        </div>

        <p className='mt-1 text-xs leading-5 text-zinc-500'>{description}</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty workspace                                                            */
/* -------------------------------------------------------------------------- */

function WorkspaceEmptyState() {
  return (
    <div className='relative flex min-h-155 items-center justify-center overflow-hidden px-5 py-12 sm:px-8 lg:min-h-170 lg:px-12'>
      {/* Subtle background */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
        <div className='absolute left-1/2 top-[38%] size-95 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50/70 blur-3xl' />

        <div className='absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-100 to-transparent' />
      </div>

      <div className='relative z-10 w-full max-w-xl'>
        {/* Mini graph illustration */}
        <div className='relative mx-auto mb-8 h-44 max-w-sm sm:mb-9'>
          {/* Main connecting lines */}
          <div className='absolute left-[29%] top-[53%] h-px w-[29%] rotate-[-31deg] bg-linear-to-r from-emerald-200 via-indigo-200 to-indigo-300' />

          <div className='absolute right-[27%] top-[52%] h-px w-[28%] rotate-31 bg-linear-to-r from-indigo-300 via-indigo-200 to-amber-200' />

          {/* Decorative path dots */}
          <div className='absolute left-[34%] top-[43%] size-2 rounded-full bg-indigo-300 ring-4 ring-indigo-50' />

          <div className='absolute right-[33%] top-[45%] size-2 rounded-full bg-indigo-300 ring-4 ring-indigo-50' />

          {/* Known node */}
          <div className='absolute left-[14%] top-[55%] flex size-12 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 shadow-[0_12px_28px_-13px_rgba(5,150,105,0.48)]'>
            <CheckCircle2 className='size-5 text-emerald-600' />
          </div>

          {/* Bridge node */}
          <div className='absolute left-1/2 top-[21%] flex size-14 -translate-x-1/2 items-center justify-center rounded-2xl border border-indigo-200 bg-indigo-50 shadow-[0_14px_34px_-14px_rgba(79,70,229,0.55)]'>
            <Network className='size-6 text-indigo-600' />
          </div>

          {/* Missing node */}
          <div className='absolute right-[13%] top-[59%] flex size-12 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 shadow-[0_12px_28px_-13px_rgba(217,119,6,0.45)]'>
            <Target className='size-5 text-amber-600' />
          </div>

          {/* Status labels */}
          <div className='absolute bottom-[5%] left-[7%] rounded-full border border-emerald-100 bg-white px-2 py-1 text-[9px] font-semibold tracking-wide text-emerald-700 shadow-sm'>
            KNOWN
          </div>

          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-indigo-100 bg-white px-2 py-1 text-[9px] font-semibold tracking-wide text-indigo-700 shadow-sm'>
            PATH
          </div>

          <div className='absolute bottom-[2%] right-[5%] rounded-full border border-amber-100 bg-white px-2 py-1 text-[9px] font-semibold tracking-wide text-amber-700 shadow-sm'>
            TARGET
          </div>
        </div>

        <div className='text-center'>
          <div className='mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-3 py-1.5 text-xs font-medium text-zinc-600 shadow-sm backdrop-blur-sm'>
            <Sparkles className='size-3.5 text-indigo-600' />
            Ready when you are
          </div>

          <h2 className='text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl'>
            Your career graph starts here.
          </h2>

          <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-500'>
            Choose your current skills and a target role. SkillGraph will
            calculate your readiness, identify missing requirements, and map
            useful prerequisite paths.
          </p>
        </div>

        <div className='mt-8 grid gap-3 sm:grid-cols-3'>
          <EmptyFeature
            icon={Target}
            title='Compare'
            description='Weighted requirements'
          />

          <EmptyFeature
            icon={CheckCircle2}
            title='Discover'
            description='Skill gaps'
          />

          <EmptyFeature
            icon={Route}
            title='Navigate'
            description='Learning paths'
          />
        </div>

        <div className='mt-8 flex items-center justify-center gap-2 text-xs font-medium text-zinc-400'>
          Complete your profile on the left
          <ArrowRight className='size-3.5' />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state feature                                                        */
/* -------------------------------------------------------------------------- */

type EmptyFeatureProps = {
  icon: ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
};

function EmptyFeature({ icon: Icon, title, description }: EmptyFeatureProps) {
  return (
    <div className='group rounded-xl border border-zinc-200 bg-white/70 p-3.5 text-center shadow-[0_6px_20px_-16px_rgba(24,24,27,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-[0_10px_24px_-16px_rgba(79,70,229,0.35)]'>
      <div className='mx-auto flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm transition-colors group-hover:border-indigo-100'>
        <Icon className='size-3.5 text-indigo-600' />
      </div>

      <p className='mt-2.5 text-xs font-semibold text-zinc-800'>{title}</p>

      <p className='mt-1 text-[11px] text-zinc-500'>{description}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Graph stats                                                                */
/* -------------------------------------------------------------------------- */

type GraphStatBadgeProps = {
  children: ReactNode;
};

function GraphStatBadge({ children }: GraphStatBadgeProps) {
  return (
    <span className='inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-1 font-medium text-zinc-500 shadow-sm'>
      {children}
    </span>
  );
}
