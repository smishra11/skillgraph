import type { Node } from '@xyflow/react';
import { X } from 'lucide-react';
import type { SkillNodeData } from './skill-node';

type SelectedNodeDetailsProps = {
  node: Node<SkillNodeData>;
  onClose: () => void;
};

export function SelectedNodeDetails({
  node,
  onClose,
}: SelectedNodeDetailsProps) {
  const data = node.data;

  const statusStyles = {
    known: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    bridge: 'border-indigo-100 bg-indigo-50 text-indigo-700',
    missing: 'border-amber-100 bg-amber-50 text-amber-700',
  };

  const statusLabels = {
    known: 'Known',
    bridge: 'Learning path',
    missing: 'Skill to develop',
  };

  return (
    <div className='flex items-start justify-between gap-3 border-t border-zinc-100 bg-zinc-50/70 px-3.5 py-2.5 sm:gap-4 sm:px-4 sm:py-3'>
      <div className='min-w-0'>
        <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
          <p className='truncate text-sm font-semibold text-zinc-900'>
            {data.name}
          </p>

          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-semibold ${statusStyles[data.status]}`}
          >
            {statusLabels[data.status]}
          </span>
        </div>

        <div className='mt-1 flex min-w-0 flex-wrap items-center gap-1.5 text-[10px] text-zinc-500 sm:text-[11px]'>
          <span className='truncate'>{data.category}</span>
          <span className='shrink-0 text-zinc-300'>•</span>
          <span className='shrink-0 capitalize'>{data.level}</span>
        </div>

        <p className='mt-1.5 line-clamp-2 text-[10px] leading-4 text-zinc-400 sm:text-[11px] sm:leading-5'>
          Select connected nodes to explore the prerequisite relationship.
        </p>
      </div>

      <button
        type='button'
        onClick={onClose}
        aria-label='Clear selected skill'
        className='flex size-7 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-200/70 hover:text-zinc-700'
      >
        <X className='size-3.5' />
      </button>
    </div>
  );
}
