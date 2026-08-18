import { Database, Network } from 'lucide-react';
import SkillGraphAnalyzer from '@/components/skillgraph-analyzer';

export default function Home() {
  return (
    <main className='relative min-h-screen overflow-x-hidden bg-[#f8fafc] text-zinc-950'>
      {/* Ambient background */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-140'
      >
        <div className='absolute -left-40 -top-40 size-105 rounded-full bg-indigo-200/25 blur-3xl sm:size-115' />
        <div className='absolute -right-40 top-8 size-100 rounded-full bg-violet-200/20 blur-3xl sm:size-110' />
        <div className='absolute left-1/2 top-0 h-px w-[88%] -translate-x-1/2 bg-linear-to-r from-transparent via-indigo-200 to-transparent sm:w-[80%] lg:w-[75%]' />
      </div>

      <div className='relative z-10 mx-auto w-full max-w-360 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10'>
        {/* Header */}
        <header className='flex min-h-17 items-center justify-between gap-3 border-b border-zinc-200/80 sm:min-h-18 md:min-h-20 md:gap-5'>
          {/* Brand */}
          <div className='flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3'>
            <div className='flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 shadow-[0_8px_20px_-8px_rgba(24,24,27,0.55)] sm:size-10'>
              <Network
                aria-hidden='true'
                className='size-4.5 text-white sm:size-5'
                strokeWidth={2}
              />
            </div>

            <div className='min-w-0'>
              <div className='flex min-w-0 items-center gap-2'>
                <p className='shrink-0 text-sm font-semibold tracking-tight text-zinc-950 sm:text-base'>
                  SkillGraph
                </p>
                <span className='hidden shrink-0 rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700 lg:inline-flex'>
                  Career Explorer
                </span>
              </div>

              <p className='mt-0.5 hidden max-w-64 truncate text-xs text-zinc-500 md:block lg:max-w-none'>
                Frontend career path intelligence
              </p>
            </div>
          </div>

          {/* CognoDB */}
          <div className='flex shrink-0 items-center gap-2 rounded-full border border-zinc-200/90 bg-white/90 px-2.5 py-2 shadow-[0_6px_18px_-10px_rgba(24,24,27,0.35)] backdrop-blur-sm sm:px-3'>
            <div className='hidden size-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 sm:flex'>
              <Database className='size-3.5 text-indigo-600' />
            </div>

            <div className='hidden lg:block'>
              <p className='text-[10px] leading-none font-medium text-zinc-400'>
                Graph powered
              </p>

              <p className='mt-1 text-xs leading-none font-semibold text-zinc-800'>
                CognoDB
              </p>
            </div>

            <span className='relative flex size-2 shrink-0'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40' />
              <span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
            </span>

            <span className='text-xs font-semibold whitespace-nowrap text-zinc-800 lg:hidden'>
              CognoDB
            </span>
          </div>
        </header>

        <SkillGraphAnalyzer />

        {/* Footer */}
        <footer className='mt-4 flex flex-col gap-2.5 border-t border-zinc-200/80 py-5 text-xs text-zinc-500 sm:mt-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-6 lg:py-7'>
          <p className='leading-5'>
            SkillGraph — Frontend Career Path Explorer
          </p>

          <div className='flex flex-wrap items-center gap-2'>
            <span>Next.js</span>
            <span className='text-zinc-300'>•</span>
            <span>CognoDB</span>
            <span className='text-zinc-300'>•</span>
            <span>React Flow</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
