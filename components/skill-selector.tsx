'use client';

import { Check, ChevronsUpDown, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type Skill = {
  id: string;
  name: string;
  slug: string;
  category: string;
  level: string;
  description: string;
};

type SkillSelectorProps = {
  skills: Skill[];
  selectedSkills: string[];
  onChange: (skills: string[]) => void;
};

export function SkillSelector({
  skills,
  selectedSkills,
  onChange,
}: SkillSelectorProps) {
  const toggleSkill = (slug: string) => {
    if (selectedSkills.includes(slug)) {
      onChange(selectedSkills.filter((skill) => skill !== slug));
      return;
    }

    onChange([...selectedSkills, slug]);
  };

  const removeSkill = (slug: string) => {
    onChange(selectedSkills.filter((skill) => skill !== slug));
  };

  const selectedSkillObjects = skills.filter((skill) =>
    selectedSkills.includes(skill.slug),
  );

  return (
    <div>
      <label className='block text-sm font-medium text-zinc-900'>
        Your current skills
      </label>

      <div className='mt-2'>
        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant='outline'
                className='w-full justify-between font-normal'
              />
            }
          >
            <span className='truncate text-left'>
              {selectedSkills.length > 0
                ? `${selectedSkills.length} skills selected`
                : 'Select the skills you already know'}
            </span>

            <ChevronsUpDown className='size-4 shrink-0 text-zinc-500' />
          </PopoverTrigger>

          <PopoverContent
            side='bottom'
            align='start'
            sideOffset={6}
            className='w-(--anchor-width) p-0'
          >
            <Command className='h-auto w-full'>
              <CommandInput placeholder='Search skills...' />

              <CommandList className='max-h-72 overflow-y-auto'>
                <CommandEmpty>No skill found.</CommandEmpty>

                <CommandGroup>
                  {skills.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.slug);

                    return (
                      <CommandItem
                        key={skill.id}
                        value={`${skill.name} ${skill.category}`}
                        onSelect={() => toggleSkill(skill.slug)}
                      >
                        <Check
                          className={
                            isSelected
                              ? 'size-4 shrink-0 opacity-100'
                              : 'size-4 shrink-0 opacity-0'
                          }
                        />

                        <div className='flex min-w-0 flex-1 items-center justify-between gap-3'>
                          <span className='truncate'>{skill.name}</span>

                          <span className='shrink-0 text-xs text-zinc-500'>
                            {skill.category}
                          </span>
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedSkillObjects.length > 0 && (
        <div className='mt-3 flex flex-wrap gap-2'>
          {selectedSkillObjects.map((skill) => (
            <Badge
              key={skill.id}
              variant='secondary'
              className='gap-1.5 px-2.5 py-1'
            >
              {skill.name}

              <button
                type='button'
                onClick={() => removeSkill(skill.slug)}
                className='rounded-full text-zinc-500 transition-colors hover:text-zinc-900'
                aria-label={`Remove ${skill.name}`}
              >
                <X className='size-3' />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
