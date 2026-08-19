import {
  CheckCircle2,
  GitBranch,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';

export function AnalyzerHero() {
  return (
    <section className='pb-8 pt-10 sm:pb-10 sm:pt-14 lg:pb-12 lg:pt-16'>
      <div className='mx-auto max-w-4xl text-center'>
        <div className='inline-flex max-w-full items-center gap-2 rounded-full border border-indigo-100 bg-white/85 px-3 py-1.5 text-[11px] font-medium text-indigo-700 shadow-[0_6px_18px_-10px_rgba(79,70,229,0.40)] backdrop-blur-sm sm:px-3.5 sm:text-xs'>
          <Sparkles aria-hidden='true' className='size-3.5 shrink-0' />

          <span className='truncate'>
            Graph-powered frontend career intelligence
          </span>
        </div>

        <h1 className='mx-auto mt-5 max-w-4xl text-3xl font-semibold leading-[1.12] tracking-[-0.04em] text-zinc-950 sm:mt-6 sm:text-4xl sm:leading-[1.12] lg:text-[3.4rem] lg:leading-[1.08]'>
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

        <p className='mx-auto mt-4 max-w-2xl px-1 text-sm leading-6 text-zinc-600 sm:mt-5 sm:px-0 sm:text-base sm:leading-7'>
          Compare your current skill set against weighted role requirements,
          identify meaningful gaps, and explore the prerequisite paths that can
          help you close them.
        </p>

        <div className='mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-7 sm:gap-3'>
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
  );
}

type HeroFeatureProps = {
  icon: LucideIcon;
  label: string;
  iconClassName: string;
};

function HeroFeature({ icon: Icon, label, iconClassName }: HeroFeatureProps) {
  return (
    <div className='inline-flex items-center gap-1.5 rounded-full border border-zinc-200/90 bg-white/75 px-2.5 py-1.5 text-[11px] font-medium text-zinc-600 shadow-[0_5px_16px_-12px_rgba(24,24,27,0.3)] backdrop-blur-sm sm:gap-2 sm:px-3 sm:text-sm'>
      <Icon className={`size-3.5 shrink-0 sm:size-4 ${iconClassName}`} />

      {label}
    </div>
  );
}
