'use client';

import { Handle, Position, type Node, type NodeProps } from '@xyflow/react';

import { cn } from '@/lib/utils';

export type SkillNodeStatus = 'known' | 'missing' | 'bridge';

export type SkillNodeData = {
  label: string;
  category: string;
  level: string;
  description: string;
  status: SkillNodeStatus;
};

export type SkillFlowNode = Node<SkillNodeData, 'skill'>;

const statusStyles: Record<SkillNodeStatus, string> = {
  known: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  missing: 'border-amber-200 bg-amber-50 text-amber-950',
  bridge: 'border-indigo-200 bg-indigo-50 text-indigo-950',
};

const statusDotStyles: Record<SkillNodeStatus, string> = {
  known: 'bg-emerald-500',
  missing: 'bg-amber-500',
  bridge: 'bg-indigo-500',
};

const statusLabels: Record<SkillNodeStatus, string> = {
  known: 'Known skill',
  missing: 'Skill to develop',
  bridge: 'Learning step',
};

export function SkillNode({ data, selected }: NodeProps<SkillFlowNode>) {
  return (
    <div
      className={cn(
        'w-44 rounded-xl border px-3.5 py-3 shadow-sm transition-[opacity,box-shadow,transform]',
        statusStyles[data.status],
        selected && 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-white',
      )}
    >
      <Handle
        type='target'
        position={Position.Left}
        className='size-2! border-2! border-white! bg-zinc-400!'
      />

      <div className='flex items-center gap-2'>
        <span
          className={cn(
            'size-2 shrink-0 rounded-full',
            statusDotStyles[data.status],
          )}
        />

        <span className='truncate text-[11px] font-medium uppercase tracking-wide opacity-60'>
          {data.category}
        </span>
      </div>

      <p className='mt-2 truncate text-sm font-semibold'>{data.label}</p>

      <p className='mt-1 text-[11px] opacity-65'>{statusLabels[data.status]}</p>

      <Handle
        type='source'
        position={Position.Right}
        className='size-2! border-2! border-white! bg-zinc-400!'
      />
    </div>
  );
}
