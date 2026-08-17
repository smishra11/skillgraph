import { AnalysisForm } from '@/components/analysis-form';

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

          <span className='text-sm text-zinc-500'>
            Graph-powered career insights
          </span>
        </header>

        <section className='grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20'>
          <div className='max-w-2xl'>
            <div className='mb-5 inline-flex rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700'>
              Frontend career intelligence
            </div>

            <h1 className='text-4xl font-semibold tracking-[-0.035em] text-zinc-950 sm:text-5xl lg:text-6xl'>
              See the skills between you and your next role.
            </h1>

            <p className='mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg'>
              Compare your current frontend skills with your target role,
              uncover the gaps, and explore the learning paths connecting them.
            </p>

            <div className='mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500'>
              <span>Weighted skill matching</span>
              <span>Graph-based learning paths</span>
              <span>Interactive skill exploration</span>
            </div>
          </div>

          <AnalysisForm />
        </section>
      </div>
    </main>
  );
}
