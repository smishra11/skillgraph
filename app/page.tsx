import { SkillGraphAnalyzer } from '@/components/skillgraph-analyzer';

export default function Home() {
  return (
    <main className='min-h-screen bg-[#f8fafc] text-zinc-950'>
      <div className='mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 lg:px-10'>
        <header className='flex items-center justify-between border-b border-zinc-200 pb-6'>
          <div className='flex items-center gap-2'>
            <div className='flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-semibold text-white'>
              SG
            </div>

            <span className='text-lg font-semibold tracking-tight'>
              SkillGraph
            </span>
          </div>

          <span className='hidden text-sm text-zinc-500 sm:block'>
            Graph-powered career insights
          </span>
        </header>

        <SkillGraphAnalyzer />
      </div>
    </main>
  );
}
