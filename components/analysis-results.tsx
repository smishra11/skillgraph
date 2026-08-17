import { Check, CircleAlert } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export type Skill = {
  id: string;
  name: string;
  slug: string;
  category: string;
  level: string;
  description: string;
};

export type SkillGapItem = {
  skill: Skill;
  importance: number;
};

export type SkillGapAnalysis = {
  role: {
    id: string;
    name: string;
    slug: string;
    level: string;
    description: string;
  };
  matchPercentage: number;
  matchedWeight: number;
  totalWeight: number;
  matchedSkills: SkillGapItem[];
  missingSkills: SkillGapItem[];
};

type AnalysisResultsProps = {
  analysis: SkillGapAnalysis;
};

function getImportanceLabel(importance: number) {
  if (importance === 5) {
    return 'Core';
  }

  if (importance === 4) {
    return 'Important';
  }

  return 'Recommended';
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const totalSkills =
    analysis.matchedSkills.length + analysis.missingSkills.length;

  return (
    <section className='space-y-4'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-sm font-medium text-indigo-600'>
            Skill gap analysis
          </p>

          <h2 className='mt-1 text-2xl font-semibold tracking-tight text-zinc-950'>
            {analysis.role.name}
          </h2>

          <p className='mt-1 max-w-2xl text-sm leading-6 text-zinc-600'>
            {analysis.role.description}
          </p>
        </div>

        <Badge variant='secondary' className='w-fit capitalize'>
          {analysis.role.level}
        </Badge>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='border-zinc-200 bg-white shadow-sm'>
          <CardContent className='p-5'>
            <div className='flex items-start justify-between gap-6'>
              <div>
                <p className='text-sm font-medium text-zinc-600'>
                  Overall match
                </p>

                <p className='mt-1 text-4xl font-semibold tracking-tight text-zinc-950'>
                  {analysis.matchPercentage}%
                </p>
              </div>

              <div className='text-right text-xs text-zinc-500'>
                <p>{analysis.matchedWeight} matched points</p>
                <p className='mt-1'>{analysis.totalWeight} total points</p>
              </div>
            </div>

            <div className='mt-4 h-2 overflow-hidden rounded-full bg-zinc-100'>
              <div
                className='h-full rounded-full bg-indigo-600 transition-[width] duration-500'
                style={{
                  width: `${analysis.matchPercentage}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className='border-zinc-200 bg-white shadow-sm'>
          <CardContent className='p-5'>
            <p className='text-sm font-medium text-zinc-600'>
              Requirement coverage
            </p>

            <div className='mt-2 flex items-end justify-between gap-4'>
              <div>
                <p className='text-2xl font-semibold text-zinc-950'>
                  {analysis.matchedSkills.length} of {totalSkills}
                </p>

                <p className='mt-1 text-sm text-zinc-500'>
                  Required skills already covered
                </p>
              </div>

              <Badge className='bg-amber-50 text-amber-700 hover:bg-amber-50'>
                {analysis.missingSkills.length} missing
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 lg:grid-cols-2'>
        <Card className='border-zinc-200 bg-white shadow-sm'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-2'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600'>
                <Check className='size-4' />
              </div>

              <div>
                <h3 className='text-sm font-semibold text-zinc-950'>
                  Skills you already have
                </h3>

                <p className='text-xs text-zinc-500'>
                  Requirements covered by your selection
                </p>
              </div>
            </div>

            {analysis.matchedSkills.length > 0 ? (
              <div className='mt-4 space-y-2'>
                {analysis.matchedSkills.map(({ skill, importance }) => (
                  <div
                    key={skill.id}
                    className='flex items-center justify-between gap-4 rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2.5'
                  >
                    <div className='min-w-0'>
                      <p className='truncate text-sm font-medium text-zinc-900'>
                        {skill.name}
                      </p>

                      <p className='text-xs text-zinc-500'>{skill.category}</p>
                    </div>

                    <Badge
                      variant='secondary'
                      className='shrink-0 bg-white text-xs'
                    >
                      {getImportanceLabel(importance)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className='mt-4 rounded-lg border border-dashed border-zinc-200 p-4 text-sm text-zinc-500'>
                None of your selected skills match this role yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='border-zinc-200 bg-white shadow-sm'>
          <CardContent className='p-5'>
            <div className='flex items-center gap-2'>
              <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600'>
                <CircleAlert className='size-4' />
              </div>

              <div>
                <h3 className='text-sm font-semibold text-zinc-950'>
                  Skills to develop
                </h3>

                <p className='text-xs text-zinc-500'>
                  Missing requirements for your target role
                </p>
              </div>
            </div>

            <div className='mt-4 space-y-2'>
              {analysis.missingSkills.map(({ skill, importance }) => (
                <div
                  key={skill.id}
                  className='flex items-center justify-between gap-4 rounded-lg border border-amber-100 bg-amber-50/50 px-3 py-2.5'
                >
                  <div className='min-w-0'>
                    <p className='truncate text-sm font-medium text-zinc-900'>
                      {skill.name}
                    </p>

                    <p className='text-xs text-zinc-500'>{skill.category}</p>
                  </div>

                  <Badge
                    variant='secondary'
                    className='shrink-0 bg-white text-xs'
                  >
                    {getImportanceLabel(importance)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
