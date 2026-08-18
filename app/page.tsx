import { Database, Network } from 'lucide-react';
import SkillGraphAnalyzer from '@/components/skillgraph-analyzer';

export default function Home() {
  return (
    <main className='relative min-h-screen overflow-hidden bg-[#f8fafc] text-zinc-950'>
      {/* Ambient page background */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-0 h-155'
      >
        <div className='absolute -left-40 -top-40 size-115 rounded-full bg-indigo-200/30 blur-3xl' />

        <div className='absolute -right-40 top-8 size-110 rounded-full bg-violet-200/20 blur-3xl' />

        <div className='absolute left-1/2 top-0 h-px w-[75%] -translate-x-1/2 bg-linear-to-r from-transparent via-indigo-200 to-transparent' />
      </div>

      <div className='relative z-10 mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8 xl:px-10'>
        {/* Header */}
        <header className='flex min-h-20 items-center justify-between border-b border-zinc-200/80'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-950 shadow-[0_8px_20px_-8px_rgba(24,24,27,0.55)]'>
              <Network
                aria-hidden='true'
                className='size-5 text-white'
                strokeWidth={2}
              />
            </div>

            <div className='min-w-0'>
              <div className='flex items-center gap-2'>
                <p className='text-sm font-semibold tracking-tight text-zinc-950 sm:text-base'>
                  SkillGraph
                </p>

                <span className='hidden rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700 sm:inline-flex'>
                  Career Explorer
                </span>
              </div>

              <p className='mt-0.5 truncate text-[11px] text-zinc-500 sm:text-xs'>
                Frontend career path intelligence
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2.5 rounded-full border border-zinc-200/90 bg-white/85 px-3 py-2 shadow-[0_6px_18px_-10px_rgba(24,24,27,0.35)] backdrop-blur-sm'>
            <div className='flex size-6 items-center justify-center rounded-full bg-indigo-50'>
              <Database className='size-3.5 text-indigo-600' />
            </div>

            <div className='hidden sm:block'>
              <p className='text-[10px] leading-none font-medium text-zinc-400'>
                Graph powered
              </p>

              <p className='mt-1 text-xs leading-none font-semibold text-zinc-800'>
                CognoDB
              </p>
            </div>

            <span className='relative flex size-2'>
              <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40' />

              <span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
            </span>

            <span className='text-xs font-semibold text-zinc-800 sm:hidden'>
              CognoDB
            </span>
          </div>
        </header>

        <SkillGraphAnalyzer />

        {/* Footer */}
        <footer className='mt-4 flex flex-col gap-3 border-t border-zinc-200/80 py-7 text-xs text-zinc-500 sm:mt-6 sm:flex-row sm:items-center sm:justify-between'>
          <p>SkillGraph — Frontend Career Path Explorer</p>

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
