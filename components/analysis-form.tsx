'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { RoleSelector } from '@/components/role-selector';
import { SkillSelector } from '@/components/skill-selector';

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

export function AnalysisForm() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);

  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

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

  function handleAnalyze() {
    console.log({
      roleSlug: selectedRole,
      selectedSkillSlugs: selectedSkills,
    });
  }

  const canAnalyze = selectedRole.length > 0 && selectedSkills.length > 0;

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
              onChange={setSelectedSkills}
            />

            <RoleSelector
              roles={roles}
              value={selectedRole}
              onChange={setSelectedRole}
            />

            <Button
              type='button'
              className='w-full'
              disabled={isLoading || !canAnalyze}
              onClick={handleAnalyze}
            >
              {isLoading ? 'Loading SkillGraph...' : 'Analyze skill gap'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
