'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Check, CircleDot, Target } from 'lucide-react';

export type SkillNodeStatus = 'known' | 'bridge' | 'missing';

export type SkillNodeData = {
  name: string;
  category: string;
  level: string;
  status: SkillNodeStatus;
};

const statusConfig = {
  known: {
    label: 'Known',
    wrapper:
      'border-emerald-200 bg-emerald-50 text-emerald-950 shadow-[0_8px_20px_-14px_rgba(5,150,105,0.45)]',
    iconWrapper: 'border-emerald-200 bg-white text-emerald-600',
    badge: 'border-emerald-200 bg-white/80 text-emerald-700',
    handle: '!bg-emerald-400 !border-emerald-100',
    icon: Check,
  },

  bridge: {
    label: 'Path',
    wrapper:
      'border-indigo-200 bg-indigo-50 text-indigo-950 shadow-[0_8px_20px_-14px_rgba(79,70,229,0.45)]',
    iconWrapper: 'border-indigo-200 bg-white text-indigo-600',
    badge: 'border-indigo-200 bg-white/80 text-indigo-700',
    handle: '!bg-indigo-400 !border-indigo-100',
    icon: CircleDot,
  },

  missing: {
    label: 'Target',
    wrapper:
      'border-amber-200 bg-amber-50 text-amber-950 shadow-[0_8px_20px_-14px_rgba(217,119,6,0.45)]',
    iconWrapper: 'border-amber-200 bg-white text-amber-600',
    badge: 'border-amber-200 bg-white/80 text-amber-700',
    handle: '!bg-amber-400 !border-amber-100',
    icon: Target,
  },
} satisfies Record<
  SkillNodeStatus,
  {
    label: string;
    wrapper: string;
    iconWrapper: string;
    badge: string;
    handle: string;
    icon: typeof Check;
  }
>;

export function SkillNode({ data, selected }: NodeProps) {
  const nodeData = data as SkillNodeData;

  const config = statusConfig[nodeData.status];

  const Icon = config.icon;

  return (
    <div
      className={`w-44 rounded-xl border px-3.5 py-3 transition-all duration-200 ${config.wrapper} ${
        selected
          ? 'ring-2 ring-indigo-500/30 ring-offset-2 ring-offset-white shadow-[0_14px_28px_-14px_rgba(79,70,229,0.45)]'
          : ''
      }`}
    >
      <Handle
        type='target'
        position={Position.Left}
        className={`size-2.5! border-2! ${config.handle}`}
      />

      <div className='flex items-start gap-2.5'>
        <div
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg border ${config.iconWrapper}`}
        >
          <Icon className='size-3.5' />
        </div>

        <div className='min-w-0 flex-1'>
          <p className='truncate text-xs font-semibold'>{nodeData.name}</p>

          <p className='mt-0.5 truncate text-[10px] opacity-65'>
            {nodeData.category}
          </p>
        </div>
      </div>

      <div className='mt-2.5 flex items-center justify-between gap-2'>
        <span
          className={`rounded-full border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.08em] ${config.badge}`}
        >
          {config.label}
        </span>

        <span className='text-[9px] font-medium capitalize opacity-55'>
          {nodeData.level}
        </span>
      </div>

      <Handle
        type='source'
        position={Position.Right}
        className={`size-2.5! border-2! ${config.handle}`}
      />
    </div>
  );
}
