import type { ComponentProps } from 'react';
import {
  CheckCircle2,
  Network,
  Route,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';

import { AnalysisForm } from '../analysis-form';

type ProfilePanelProps = {
  onAnalysisChange: ComponentProps<typeof AnalysisForm>['onAnalysisChange'];
};

export function ProfilePanel({ onAnalysisChange }: ProfilePanelProps) {
  return (
    <aside className='relative border-b border-zinc-200 bg-zinc-50/75 lg:border-r lg:border-b-0'>
      <div className='lg:sticky lg:top-6'>
        <div className='p-4 sm:p-5 lg:p-6'>
          {/* Panel introduction */}
          <div className='mb-5 sm:mb-6'>
            <div className='flex items-center gap-2.5'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-[0_5px_14px_-9px_rgba(24,24,27,0.35)]'>
                <Target className='size-4 text-indigo-600' />
              </div>

              <span className='text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500'>
                Your profile
              </span>
            </div>

            <h2 className='mt-3.5 text-lg font-semibold tracking-tight text-zinc-950 sm:mt-4 sm:text-xl'>
              Where are you today?
            </h2>

            <p className='mt-1.5 text-sm leading-6 text-zinc-500 sm:mt-2'>
              Select your current skills and the role you want to evaluate.
            </p>
          </div>

          {/* Profile builder */}
          <div className='rounded-xl border border-indigo-100 bg-white p-4 shadow-[0_14px_34px_-22px_rgba(79,70,229,0.32)] sm:rounded-2xl sm:p-5'>
            <div className='mb-4 flex items-start justify-between gap-3'>
              <div className='min-w-0'>
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

            <AnalysisForm onAnalysisChange={onAnalysisChange} />
          </div>

          {/* How it works */}
          <div className='mt-6 border-t border-zinc-200 pt-5 sm:pt-6'>
            <p className='text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400'>
              How SkillGraph works
            </p>

            <div className='mt-4 space-y-4 sm:mt-5 sm:space-y-5'>
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
          <div className='mt-6 rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 shadow-[0_8px_24px_-18px_rgba(79,70,229,0.35)] sm:p-4'>
            <div className='flex items-start gap-3'>
              <div className='flex size-7 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm'>
                <Network className='size-3.5 text-indigo-600' />
              </div>

              <p className='pt-0.5 text-xs leading-5 text-indigo-950/70'>
                Recommendations are generated from relationships between roles,
                required skills, and prerequisite skills stored in CognoDB.
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

type HowItWorksItemProps = {
  number: string;
  icon: LucideIcon;
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
