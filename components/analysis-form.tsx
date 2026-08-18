'use client';

import { useEffect, useState } from 'react';

import type { SkillGapAnalysis } from '@/components/analysis-results';
import { RoleSelector } from '@/components/role-selector';
import { SkillSelector } from '@/components/skill-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { LearningPath } from '@/components/graph/skill-graph';

type Role = {
  id: string;
  name: string;
  slug: string;
  level: string;
  description: string;
};

type Skill = {
  id: string;
  name: string;
  slug: string;
  category: string;
  level: string;
  description: string;
};

export type SkillGraphResult = {
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
    async function loadData() {
      try {
        setIsLoading(true);
        setLoadError('');

        const [rolesResponse, skillsResponse] = await Promise.all([
          fetch('/api/roles'),
          fetch('/api/skills'),
        ]);

        if (!rolesResponse.ok || !skillsResponse.ok) {
          throw new Error('Unable to load SkillGraph data.');
        }

        const rolesData = await rolesResponse.json();
        const skillsData = await skillsResponse.json();

        setRoles(rolesData.data);
        setSkills(skillsData.data);
      } catch {
        setLoadError(
          "We couldn't load the available roles and skills. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleAnalyze() {
    if (!selectedRole || selectedSkills.length === 0) {
      return;
    }

    try {
      setIsAnalyzing(true);
      setAnalysisError('');
      onAnalysisChange(null);

      const requestBody = {
        roleSlug: selectedRole,
        selectedSkillSlugs: selectedSkills,
      };

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

      const analysisResult = await analysisResponse.json();

      if (!analysisResponse.ok) {
        throw new Error(analysisResult.error ?? 'Unable to analyze skill gap.');
      }

      let learningPaths: LearningPath[] = [];
      let graphError = '';

      if (learningPathsResponse.ok) {
        const learningPathsResult = await learningPathsResponse.json();

        learningPaths = learningPathsResult.data;
      } else {
        graphError =
          'Your skill analysis is available, but the learning graph could not be loaded.';
      }

      onAnalysisChange({
        analysis: analysisResult.data,
        learningPaths,
        selectedSkillSlugs: [...selectedSkills],
        graphError,
      });
    } catch (error) {
      onAnalysisChange(null);

      setAnalysisError(
        error instanceof Error ? error.message : 'Unable to analyze skill gap.',
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleRoleChange(value: string) {
    setSelectedRole(value);
    setAnalysisError('');
    onAnalysisChange(null);
  }

  function handleSkillsChange(value: string[]) {
    setSelectedSkills(value);
    setAnalysisError('');
    onAnalysisChange(null);
  }

  const canAnalyze =
    selectedRole.length > 0 && selectedSkills.length > 0 && !isAnalyzing;

  return (
    <Card className='border-zinc-200 bg-white shadow-sm'>
      <CardContent className='space-y-6 p-6 sm:p-8'>
        {loadError ? (
          <div className='rounded-lg border border-red-200 bg-red-50 p-4'>
            <p className='text-sm font-medium text-red-900'>
              Unable to load SkillGraph
            </p>

            <p className='mt-1 text-sm text-red-700'>{loadError}</p>
          </div>
        ) : (
          <>
            <SkillSelector
              skills={skills}
              selectedSkills={selectedSkills}
              onChange={handleSkillsChange}
            />

            <RoleSelector
              roles={roles}
              value={selectedRole}
              onChange={handleRoleChange}
            />

            {analysisError && (
              <div className='rounded-lg border border-red-200 bg-red-50 px-4 py-3'>
                <p className='text-sm text-red-700'>{analysisError}</p>
              </div>
            )}

            <Button
              type='button'
              className='w-full'
              disabled={isLoading || !canAnalyze}
              onClick={handleAnalyze}
            >
              {isLoading
                ? 'Loading SkillGraph...'
                : isAnalyzing
                  ? 'Analyzing your skills...'
                  : 'Analyze skill gap'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
