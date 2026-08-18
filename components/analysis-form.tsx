'use client';

import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { RoleSelector } from './role-selector';
import { SkillSelector } from './skill-selector';

import type {
  LearningPath,
  Role,
  Skill,
  SkillGapAnalysis,
} from '@/lib/db/queries';

type SkillGraphResult = {
  analysis: SkillGapAnalysis;
  learningPaths: LearningPath[];
  selectedSkillSlugs: string[];
  graphError: string;
};

type AnalysisFormProps = {
  onAnalysisChange: (result: SkillGraphResult | null) => void;
};

export function AnalysisForm({ onAnalysisChange }: AnalysisFormProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function fetchInitialData() {
      try {
        const [rolesResponse, skillsResponse] = await Promise.all([
          fetch('/api/roles'),
          fetch('/api/skills'),
        ]);

        if (!rolesResponse.ok || !skillsResponse.ok) {
          throw new Error('Unable to load SkillGraph data.');
        }

        const [rolesPayload, skillsPayload] = await Promise.all([
          rolesResponse.json(),
          skillsResponse.json(),
        ]);

        if (cancelled) {
          return;
        }

        setRoles(rolesPayload.data ?? []);
        setSkills(skillsPayload.data ?? []);
      } catch {
        if (cancelled) {
          return;
        }

        setLoadError(
          'We could not load the available skills and roles. Please try again.',
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void fetchInitialData();

    return () => {
      cancelled = true;
    };
  }, []);

  async function retryLoadData() {
    setIsLoading(true);
    setLoadError('');

    try {
      const [rolesResponse, skillsResponse] = await Promise.all([
        fetch('/api/roles'),
        fetch('/api/skills'),
      ]);

      if (!rolesResponse.ok || !skillsResponse.ok) {
        throw new Error('Unable to load SkillGraph data.');
      }

      const [rolesPayload, skillsPayload] = await Promise.all([
        rolesResponse.json(),
        skillsResponse.json(),
      ]);

      setRoles(rolesPayload.data ?? []);
      setSkills(skillsPayload.data ?? []);
    } catch {
      setLoadError(
        'We could not load the available skills and roles. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleRoleChange(roleSlug: string) {
    setSelectedRole(roleSlug);
    setAnalysisError('');
    onAnalysisChange(null);
  }

  function handleSkillsChange(skillSlugs: string[]) {
    setSelectedSkills(skillSlugs);
    setAnalysisError('');
    onAnalysisChange(null);
  }

  async function handleAnalyze() {
    if (!selectedRole || selectedSkills.length === 0) {
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError('');
    onAnalysisChange(null);

    const requestBody = {
      roleSlug: selectedRole,
      selectedSkillSlugs: selectedSkills,
    };

    try {
      const [analysisResponse, learningPathsResponse] = await Promise.all([
        fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }),

        fetch('/api/learning-paths', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }),
      ]);

      if (!analysisResponse.ok) {
        const errorPayload = await analysisResponse.json().catch(() => null);

        throw new Error(
          errorPayload?.error ?? 'SkillGraph could not complete the analysis.',
        );
      }

      const analysisPayload = await analysisResponse.json();

      let learningPaths: LearningPath[] = [];
      let graphError = '';

      if (learningPathsResponse.ok) {
        const learningPathsPayload = await learningPathsResponse.json();

        learningPaths = learningPathsPayload.data ?? [];
      } else {
        graphError =
          'Your skill-gap analysis is available, but the learning graph could not be loaded.';
      }

      onAnalysisChange({
        analysis: analysisPayload.data,
        learningPaths,
        selectedSkillSlugs: [...selectedSkills],
        graphError,
      });
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : 'Something went wrong while analyzing your profile.',
      );

      onAnalysisChange(null);
    } finally {
      setIsAnalyzing(false);
    }
  }

  if (isLoading) {
    return (
      <div className='rounded-xl border border-zinc-200 bg-white p-5 shadow-[0_8px_24px_-18px_rgba(24,24,27,0.35)]'>
        <div className='flex items-center gap-3'>
          <div className='flex size-9 items-center justify-center rounded-lg bg-indigo-50'>
            <Loader2 className='size-4 animate-spin text-indigo-600' />
          </div>

          <div>
            <p className='text-sm font-medium text-zinc-800'>
              Loading career data
            </p>

            <p className='mt-0.5 text-xs text-zinc-500'>
              Fetching skills and frontend roles...
            </p>
          </div>
        </div>

        <div className='mt-5 space-y-4'>
          <div>
            <div className='h-3 w-24 animate-pulse rounded bg-zinc-100' />

            <div className='mt-2 h-10 animate-pulse rounded-lg bg-zinc-100' />
          </div>

          <div>
            <div className='h-3 w-20 animate-pulse rounded bg-zinc-100' />

            <div className='mt-2 h-10 animate-pulse rounded-lg bg-zinc-100' />
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className='rounded-xl border border-red-200 bg-red-50/80 p-4 shadow-[0_8px_22px_-18px_rgba(220,38,38,0.3)]'>
        <div className='flex items-start gap-3'>
          <div className='flex size-8 shrink-0 items-center justify-center rounded-lg bg-white'>
            <AlertCircle className='size-4 text-red-600' />
          </div>

          <div className='min-w-0'>
            <p className='text-sm font-semibold text-red-900'>
              Unable to load SkillGraph
            </p>

            <p className='mt-1 text-xs leading-5 text-red-700'>{loadError}</p>
          </div>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={retryLoadData}
          className='mt-4 w-full border-red-200 bg-white text-red-700 hover:bg-red-50 hover:text-red-800'
        >
          <RefreshCw className='size-3.5' />
          Try again
        </Button>
      </div>
    );
  }

  const canAnalyze =
    selectedRole.length > 0 && selectedSkills.length > 0 && !isAnalyzing;

  return (
    <div>
      <div className='space-y-5'>
        {/* Current skills */}
        <div>
          <div className='mb-2 flex items-end justify-between gap-3'>
            <div>
              <label className='text-sm font-semibold text-zinc-800'>
                Current skills
              </label>

              <p className='mt-0.5 text-[11px] leading-4 text-zinc-500'>
                Select everything you already know.
              </p>
            </div>

            {selectedSkills.length > 0 && (
              <span className='shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700'>
                {selectedSkills.length} selected
              </span>
            )}
          </div>

          <SkillSelector
            skills={skills}
            selectedSkills={selectedSkills}
            onChange={handleSkillsChange}
          />
        </div>

        {/* Target role */}
        <div>
          <div className='mb-2'>
            <label className='text-sm font-semibold text-zinc-800'>
              Target role
            </label>

            <p className='mt-0.5 text-[11px] leading-4 text-zinc-500'>
              Choose the frontend role you want to evaluate.
            </p>
          </div>

          <RoleSelector
            roles={roles}
            value={selectedRole}
            onChange={handleRoleChange}
          />
        </div>
      </div>

      {/* Analyze action */}
      <div className='mt-6'>
        <Button
          type='button'
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className='group h-11 w-full rounded-xl bg-zinc-950 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(24,24,27,0.55)] transition-all hover:bg-indigo-600 hover:shadow-[0_12px_28px_-12px_rgba(79,70,229,0.5)] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400 disabled:shadow-none'
        >
          {isAnalyzing ? (
            <>
              <Loader2 className='size-4 animate-spin' />
              Analyzing your profile...
            </>
          ) : (
            <>
              <Sparkles className='size-4' />
              Analyze career path
              <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </>
          )}
        </Button>

        {!selectedRole || selectedSkills.length === 0 ? (
          <p className='mt-2.5 text-center text-[11px] leading-4 text-zinc-400'>
            Select at least one skill and a target role to continue.
          </p>
        ) : (
          <div className='mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-emerald-600'>
            <span className='size-1.5 rounded-full bg-emerald-500' />
            Ready to analyze
          </div>
        )}
      </div>

      {/* Analysis error */}
      {analysisError && (
        <div className='mt-4 rounded-xl border border-red-200 bg-red-50/80 p-3.5'>
          <div className='flex items-start gap-2.5'>
            <AlertCircle className='mt-0.5 size-4 shrink-0 text-red-600' />

            <div>
              <p className='text-xs font-semibold text-red-800'>
                Analysis failed
              </p>

              <p className='mt-1 text-xs leading-5 text-red-600'>
                {analysisError}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
