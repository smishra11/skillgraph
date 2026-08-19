import {
  ArrowRight,
  CheckCircle2,
  Network,
  Route,
  Sparkles,
  Target,
  type LucideIcon,
} from 'lucide-react';

export function WorkspaceEmptyState() {
  return (
    <div className='relative flex min-h-130 items-center justify-center overflow-hidden px-4 py-8 sm:min-h-145 sm:px-6 sm:py-10 lg:min-h-170 lg:px-8 lg:py-12'>
      {/* Subtle background */}
      <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
        <div className='absolute left-1/2 top-[38%] size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50/70 blur-3xl sm:size-95' />

        <div className='absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-100 to-transparent' />
      </div>

      <div className='relative z-10 w-full max-w-xl'>
        {/* Mini graph illustration */}
        <div className='relative mx-auto mb-6 h-36 max-w-xs sm:mb-8 sm:h-44 sm:max-w-sm'>
          <div className='absolute left-[29%] top-[53%] h-px w-[29%] rotate-[-31deg] bg-linear-to-r from-emerald-200 via-indigo-200 to-indigo-300' />

          <div className='absolute right-[27%] top-[52%] h-px w-[28%] rotate-31 bg-linear-to-r from-indigo-300 via-indigo-200 to-amber-200' />

          <div className='absolute left-[34%] top-[43%] size-2 rounded-full bg-indigo-300 ring-4 ring-indigo-50' />

          <div className='absolute right-[33%] top-[45%] size-2 rounded-full bg-indigo-300 ring-4 ring-indigo-50' />

          {/* Known node */}
          <div className='absolute left-[14%] top-[55%] flex size-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 shadow-[0_12px_28px_-13px_rgba(5,150,105,0.48)] sm:size-12 sm:rounded-2xl'>
            <CheckCircle2 className='size-4 text-emerald-600 sm:size-5' />
          </div>

          {/* Bridge node */}
          <div className='absolute left-1/2 top-[21%] flex size-12 -translate-x-1/2 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 shadow-[0_14px_34px_-14px_rgba(79,70,229,0.55)] sm:size-14 sm:rounded-2xl'>
            <Network className='size-5 text-indigo-600 sm:size-6' />
          </div>

          {/* Missing node */}
          <div className='absolute right-[13%] top-[59%] flex size-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 shadow-[0_12px_28px_-13px_rgba(217,119,6,0.45)] sm:size-12 sm:rounded-2xl'>
            <Target className='size-4 text-amber-600 sm:size-5' />
          </div>

          {/* Status labels */}
          <div className='absolute bottom-[5%] left-[7%] rounded-full border border-emerald-100 bg-white px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-emerald-700 shadow-sm sm:px-2 sm:py-1 sm:text-[9px]'>
            KNOWN
          </div>

          <div className='absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-indigo-100 bg-white px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-indigo-700 shadow-sm sm:px-2 sm:py-1 sm:text-[9px]'>
            PATH
          </div>

          <div className='absolute right-[5%] bottom-[2%] rounded-full border border-amber-100 bg-white px-1.5 py-0.5 text-[8px] font-semibold tracking-wide text-amber-700 shadow-sm sm:px-2 sm:py-1 sm:text-[9px]'>
            TARGET
          </div>
        </div>

        <div className='text-center'>
          <div className='mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/85 px-3 py-1.5 text-[11px] font-medium text-zinc-600 shadow-sm backdrop-blur-sm sm:mb-4 sm:text-xs'>
            <Sparkles className='size-3.5 text-indigo-600' />
            Ready when you are
          </div>

          <h2 className='text-xl font-semibold tracking-tight text-zinc-950 sm:text-2xl lg:text-3xl'>
            Your career graph starts here.
          </h2>

          <p className='mx-auto mt-2.5 max-w-md text-sm leading-6 text-zinc-500 sm:mt-3'>
            Choose your current skills and a target role. SkillGraph will
            calculate your readiness, identify missing requirements, and map
            useful prerequisite paths.
          </p>
        </div>

        <div className='mt-6 grid gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-3'>
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

        <div className='mt-6 flex items-center justify-center gap-2 text-[11px] font-medium text-zinc-400 sm:mt-8 sm:text-xs'>
          Complete your profile on the left
          <ArrowRight className='size-3.5' />
        </div>
      </div>
    </div>
  );
}

type EmptyFeatureProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

function EmptyFeature({ icon: Icon, title, description }: EmptyFeatureProps) {
  return (
    <div className='group rounded-xl border border-zinc-200 bg-white/70 p-3 text-center shadow-[0_6px_20px_-16px_rgba(24,24,27,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/40 hover:shadow-[0_10px_24px_-16px_rgba(79,70,229,0.35)] sm:p-3.5'>
      <div className='mx-auto flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-white shadow-sm transition-colors group-hover:border-indigo-100'>
        <Icon className='size-3.5 text-indigo-600' />
      </div>

      <p className='mt-2 text-xs font-semibold text-zinc-800 sm:mt-2.5'>
        {title}
      </p>

      <p className='mt-1 text-[11px] text-zinc-500'>{description}</p>
    </div>
  );
}
