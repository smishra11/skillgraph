'use client';

import { useMemo, useState } from 'react';
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  ReactFlow,
  useNodesState,
} from '@xyflow/react';
import { Network } from 'lucide-react';

import type { LearningPath } from '@/lib/db/queries';

import { buildSkillGraph } from './build-skill-graph';
import { GraphEmptyState } from './graph-empty-state';
import { SelectedNodeDetails } from './selected-node-details';
import { SkillNode, type SkillNodeStatus } from './skill-node';

type SkillGraphProps = {
  learningPaths: LearningPath[];
  selectedSkillSlugs: string[];
  missingSkillSlugs: string[];
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
    () => buildSkillGraph(learningPaths, selectedSkillSlugs, missingSkillSlugs),
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
    return <GraphEmptyState hasMissingSkills={missingSkillSlugs.length > 0} />;
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
