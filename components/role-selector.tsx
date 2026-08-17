'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Role = {
  id: string;
  name: string;
  slug: string;
  level: string;
  description: string;
};

type RoleSelectorProps = {
  roles: Role[];
  value: string;
  onChange: (value: string) => void;
};

export function RoleSelector({ roles, value, onChange }: RoleSelectorProps) {
  return (
    <div className='space-y-2'>
      <label className='text-sm font-medium text-zinc-900'>Target role</label>

      <Select
        value={value}
        onValueChange={(newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select your target role' />
        </SelectTrigger>

        <SelectContent>
          {roles.map((role) => (
            <SelectItem key={role.id} value={role.slug}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
