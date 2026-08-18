'use client';

import { useMemo, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  useNodesState,
  type Edge,
  type Node,
} from '@xyflow/react';
import {
  CheckCircle2,
  GitBranch,
  Network,
  Route,
  Target,
  X,
} from 'lucide-react';

import type { LearningPath, Skill } from '@/lib/db/queries';

import {
  SkillNode,
  type SkillNodeData,
  type SkillNodeStatus,
} from './skill-node';

type SkillGraphProps = {
  learningPaths: LearningPath[];
  selectedSkillSlugs: string[];
  missingSkillSlugs: string[];
};

type SkillGraphBuildResult = {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
};

const nodeTypes = {
  skill: SkillNode,
};

export function SkillGraph({
  learningPaths,
  selectedSkillSlugs,
  missingSkillSlugs,
}: SkillGraphProps) {
  const graph = useMemo(
    () => buildGraph(learningPaths, selectedSkillSlugs, missingSkillSlugs),
    [learningPaths, selectedSkillSlugs, missingSkillSlugs],
  );

  const [nodes, , onNodesChange] = useNodesState(graph.nodes);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;

  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) {
      return new Set<string>();
    }

    const ids = new Set<string>([selectedNodeId]);

    for (const edge of graph.edges) {
      if (edge.source === selectedNodeId) {
        ids.add(edge.target);
      }

      if (edge.target === selectedNodeId) {
        ids.add(edge.source);
      }
    }

    return ids;
  }, [graph.edges, selectedNodeId]);

  const displayNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,

        selected: node.id === selectedNodeId,

        style: {
          ...node.style,

          opacity: selectedNodeId && !connectedNodeIds.has(node.id) ? 0.22 : 1,

          transition: 'opacity 180ms ease',
        },
      })),
    [nodes, selectedNodeId, connectedNodeIds],
  );

  const displayEdges = useMemo(
    () =>
      graph.edges.map((edge) => {
        const isConnected =
          selectedNodeId &&
          (edge.source === selectedNodeId || edge.target === selectedNodeId);

        return {
          ...edge,

          animated: Boolean(isConnected),

          style: {
            stroke: isConnected ? '#6366f1' : '#a1a1aa',

            strokeWidth: isConnected ? 2 : 1.5,

            opacity: selectedNodeId && !isConnected ? 0.12 : 1,

            transition: 'opacity 180ms ease, stroke 180ms ease',
          },

          markerEnd: {
            type: MarkerType.ArrowClosed,

            color: isConnected ? '#6366f1' : '#a1a1aa',

            width: 14,
            height: 14,
          },
        };
      }),
    [graph.edges, selectedNodeId],
  );

  if (learningPaths.length === 0) {
    return <GraphEmptyState />;
  }

  return (
    <div className='overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_14px_38px_-28px_rgba(24,24,27,0.40)] sm:rounded-2xl'>
      {/* Graph toolbar */}
      <div className='flex flex-col gap-2.5 border-b border-zinc-100 bg-white px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4 sm:py-3.5'>
        <div className='flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2'>
          <LegendItem type='known' label='Known skill' />

          <LegendItem type='bridge' label='Learning path' />

          <LegendItem type='missing' label='Skill to develop' />
        </div>

        <div className='hidden items-center gap-1.5 text-[10px] font-medium text-zinc-400 sm:flex'>
          <Network className='size-3 shrink-0' />
          Click a node to explore connections
        </div>
      </div>

      {/* Flow canvas */}
      <div className='relative h-75 w-full bg-[#fcfcfd] sm:h-95 md:h-105 lg:h-120'>
        <ReactFlow
          nodes={displayNodes}
          edges={displayEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={(_, node) => {
            setSelectedNodeId((current) =>
              current === node.id ? null : node.id,
            );
          }}
          onPaneClick={() => {
            setSelectedNodeId(null);
          }}
          nodesDraggable
          nodesConnectable={false}
          edgesReconnectable={false}
          deleteKeyCode={null}
          fitView
          fitViewOptions={{
            padding: 0.25,
            minZoom: 0.5,
            maxZoom: 1.2,
          }}
          minZoom={0.35}
          maxZoom={1.75}
          panOnDrag
          zoomOnScroll
          colorMode='light'
          proOptions={{
            hideAttribution: true,
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={22}
            size={1}
            color='#d4d4d8'
          />

          <Controls
            position='bottom-left'
            showInteractive={false}
            className='overflow-hidden! rounded-xl! border! border-zinc-200! bg-white! shadow-md!'
          />
        </ReactFlow>

        {/* Canvas helper */}
        {!selectedNodeId && (
          <div className='pointer-events-none absolute right-3 top-3 hidden rounded-lg border border-zinc-200 bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-zinc-400 shadow-sm backdrop-blur-sm md:block'>
            Drag nodes · Scroll to zoom
          </div>
        )}
      </div>

      {/* Selected skill detail */}
      {selectedNode && (
        <SelectedNodeDetails
          node={selectedNode}
          onClose={() => setSelectedNodeId(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Build graph                                                                */
/* -------------------------------------------------------------------------- */

function buildGraph(
  learningPaths: LearningPath[],
  selectedSkillSlugs: string[],
  missingSkillSlugs: string[],
): SkillGraphBuildResult {
  const selectedSkillSet = new Set(selectedSkillSlugs);

  const missingSkillSet = new Set(missingSkillSlugs);

  const skills = new Map<string, Skill>();

  const depths = new Map<string, number>();

  const edgeMap = new Map<string, Edge>();

  for (const learningPath of learningPaths) {
    learningPath.path.forEach((skill, index) => {
      skills.set(skill.slug, skill);

      const existingDepth = depths.get(skill.slug);

      if (existingDepth === undefined || index < existingDepth) {
        depths.set(skill.slug, index);
      }
    });

    for (let index = 0; index < learningPath.path.length - 1; index += 1) {
      const source = learningPath.path[index];

      const target = learningPath.path[index + 1];

      const edgeId = `${source.slug}-${target.slug}`;

      if (!edgeMap.has(edgeId)) {
        edgeMap.set(edgeId, {
          id: edgeId,
          source: source.slug,
          target: target.slug,
          type: 'smoothstep',

          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#a1a1aa',
            width: 14,
            height: 14,
          },

          style: {
            stroke: '#a1a1aa',
            strokeWidth: 1.5,
          },
        });
      }
    }
  }

  const groupedByDepth = new Map<number, Skill[]>();

  for (const skill of skills.values()) {
    const depth = depths.get(skill.slug) ?? 0;

    const group = groupedByDepth.get(depth) ?? [];

    group.push(skill);

    groupedByDepth.set(depth, group);
  }

  const nodes: Node<SkillNodeData>[] = [];

  const sortedDepths = Array.from(groupedByDepth.keys()).sort((a, b) => a - b);

  for (const depth of sortedDepths) {
    const group = groupedByDepth.get(depth) ?? [];

    group.sort((a, b) => a.name.localeCompare(b.name));

    group.forEach((skill, index) => {
      let status: SkillNodeStatus = 'bridge';

      if (selectedSkillSet.has(skill.slug)) {
        status = 'known';
      } else if (missingSkillSet.has(skill.slug)) {
        status = 'missing';
      }

      nodes.push({
        id: skill.slug,

        type: 'skill',

        position: {
          x: depth * 225,
          y: index * 110,
        },

        data: {
          name: skill.name,
          category: skill.category,
          level: skill.level,
          status,
        },
      });
    });
  }

  return {
    nodes,
    edges: Array.from(edgeMap.values()),
  };
}

/* -------------------------------------------------------------------------- */
/* Legend                                                                     */
/* -------------------------------------------------------------------------- */

type LegendItemProps = {
  type: SkillNodeStatus;
  label: string;
};

function LegendItem({ type, label }: LegendItemProps) {
  const styles = {
    known: {
      dot: 'bg-emerald-500',
      text: 'text-emerald-700',
    },

    bridge: {
      dot: 'bg-indigo-500',
      text: 'text-indigo-700',
    },

    missing: {
      dot: 'bg-amber-500',
      text: 'text-amber-700',
    },
  };

  return (
    <div className='flex items-center gap-1.5'>
      <span className={`size-2 shrink-0 rounded-full ${styles[type].dot}`} />

      <span
        className={`text-[9px] font-semibold whitespace-nowrap sm:text-[10px] ${styles[type].text}`}
      >
        {label}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Selected node                                                              */
/* -------------------------------------------------------------------------- */

type SelectedNodeDetailsProps = {
  node: Node<SkillNodeData>;
  onClose: () => void;
};

function SelectedNodeDetails({ node, onClose }: SelectedNodeDetailsProps) {
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

/* -------------------------------------------------------------------------- */
/* Empty graph                                                                */
/* -------------------------------------------------------------------------- */

function GraphEmptyState() {
  return (
    <div className='relative overflow-hidden rounded-xl border border-zinc-200 bg-white px-4 py-7 text-center shadow-[0_10px_30px_-24px_rgba(24,24,27,0.35)] sm:rounded-2xl sm:px-6 sm:py-8 lg:px-8 lg:py-10'>
      <div
        aria-hidden='true'
        className='absolute left-1/2 top-0 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-50 blur-3xl sm:size-44'
      />

      <div className='relative'>
        <div className='mx-auto flex size-10 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 shadow-sm sm:size-11'>
          <Route className='size-4.5 text-indigo-600 sm:size-5' />
        </div>

        <h4 className='mt-3.5 text-sm font-semibold text-zinc-900 sm:mt-4'>
          No additional learning path needed
        </h4>

        <p className='mx-auto mt-2 max-w-md text-xs leading-5 text-zinc-500'>
          SkillGraph did not find a prerequisite path from your selected skills
          to the remaining requirements. This can also happen when you already
          cover the relevant skills for this role.
        </p>

        <div className='mt-4 flex flex-wrap items-center justify-center gap-2.5 text-[9px] font-medium text-zinc-400 sm:mt-5 sm:gap-3 sm:text-[10px]'>
          <span className='inline-flex items-center gap-1.5'>
            <CheckCircle2 className='size-3 text-emerald-500' />
            Known
          </span>

          <span className='inline-flex items-center gap-1.5'>
            <GitBranch className='size-3 text-indigo-500' />
            Prerequisites
          </span>

          <span className='inline-flex items-center gap-1.5'>
            <Target className='size-3 text-amber-500' />
            Target
          </span>
        </div>
      </div>
    </div>
  );
}
