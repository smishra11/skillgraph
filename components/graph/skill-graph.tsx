'use client';

import { useMemo, useState } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  ReactFlow,
  useNodesState,
  type Edge,
} from '@xyflow/react';
import { X } from 'lucide-react';

import {
  SkillNode,
  type SkillFlowNode,
  type SkillNodeStatus,
} from '@/components/graph/skill-node';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export type LearningPathSkill = {
  id: string;
  name: string;
  slug: string;
  category: string;
  level: string;
  description: string;
};

export type LearningPath = {
  fromSkill: LearningPathSkill;
  toSkill: LearningPathSkill;
  hops: number;
  path: LearningPathSkill[];
};

type SkillGraphProps = {
  learningPaths: LearningPath[];
  selectedSkillSlugs: string[];
  missingSkillSlugs: string[];
};

const nodeTypes = {
  skill: SkillNode,
};

function buildGraph(
  learningPaths: LearningPath[],
  selectedSkillSlugs: string[],
  missingSkillSlugs: string[],
) {
  const selectedSet = new Set(selectedSkillSlugs);
  const missingSet = new Set(missingSkillSlugs);

  const skills = new Map<string, LearningPathSkill>();
  const depths = new Map<string, number>();
  const graphEdges = new Map<string, Edge>();

  for (const learningPath of learningPaths) {
    learningPath.path.forEach((skill, index) => {
      skills.set(skill.slug, skill);

      const existingDepth = depths.get(skill.slug);

      if (existingDepth === undefined || index < existingDepth) {
        depths.set(skill.slug, index);
      }

      const nextSkill = learningPath.path[index + 1];

      if (!nextSkill) {
        return;
      }

      const edgeId = `${skill.slug}-${nextSkill.slug}`;

      if (!graphEdges.has(edgeId)) {
        graphEdges.set(edgeId, {
          id: edgeId,
          source: skill.slug,
          target: nextSkill.slug,
          type: 'smoothstep',

          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 14,
            height: 14,
          },

          style: {
            stroke: '#a1a1aa',
            strokeWidth: 1.5,
          },
        });
      }
    });
  }

  const skillsByDepth = new Map<number, LearningPathSkill[]>();

  for (const skill of skills.values()) {
    const depth = depths.get(skill.slug) ?? 0;

    const currentSkills = skillsByDepth.get(depth) ?? [];

    currentSkills.push(skill);

    skillsByDepth.set(depth, currentSkills);
  }

  const nodes: SkillFlowNode[] = [];

  const sortedDepths = Array.from(skillsByDepth.keys()).sort((a, b) => a - b);

  for (const depth of sortedDepths) {
    const depthSkills = skillsByDepth.get(depth) ?? [];

    const sortedSkills = [...depthSkills].sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    sortedSkills.forEach((skill, index) => {
      let status: SkillNodeStatus = 'bridge';

      if (selectedSet.has(skill.slug)) {
        status = 'known';
      } else if (missingSet.has(skill.slug)) {
        status = 'missing';
      }

      nodes.push({
        id: skill.slug,
        type: 'skill',

        position: {
          x: depth * 225,
          y: index * 105,
        },

        data: {
          label: skill.name,
          category: skill.category,
          level: skill.level,
          description: skill.description,
          status,
        },
      });
    });
  }

  return {
    nodes,
    edges: Array.from(graphEdges.values()),
  };
}

export function SkillGraph({
  learningPaths,
  selectedSkillSlugs,
  missingSkillSlugs,
}: SkillGraphProps) {
  const graph = useMemo(
    () => buildGraph(learningPaths, selectedSkillSlugs, missingSkillSlugs),
    [learningPaths, selectedSkillSlugs, missingSkillSlugs],
  );

  const [nodes, , onNodesChange] = useNodesState<SkillFlowNode>(graph.nodes);

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const connectedNodeIds = useMemo(() => {
    if (!selectedNodeId) {
      return null;
    }

    const connected = new Set<string>([selectedNodeId]);

    for (const edge of graph.edges) {
      if (edge.source === selectedNodeId) {
        connected.add(edge.target);
      }

      if (edge.target === selectedNodeId) {
        connected.add(edge.source);
      }
    }

    return connected;
  }, [graph.edges, selectedNodeId]);

  const displayNodes = useMemo(() => {
    return nodes.map((node) => ({
      ...node,

      style: {
        ...node.style,

        opacity: connectedNodeIds && !connectedNodeIds.has(node.id) ? 0.2 : 1,
      },
    }));
  }, [nodes, connectedNodeIds]);

  const displayEdges = useMemo(() => {
    return graph.edges.map((edge) => {
      if (!selectedNodeId) {
        return edge;
      }

      const isConnected =
        edge.source === selectedNodeId || edge.target === selectedNodeId;

      return {
        ...edge,

        animated: isConnected,

        style: {
          ...edge.style,

          opacity: isConnected ? 1 : 0.12,

          stroke: isConnected ? '#6366f1' : '#a1a1aa',

          strokeWidth: isConnected ? 2.25 : 1.5,
        },
      };
    });
  }, [graph.edges, selectedNodeId]);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;

  function clearSelection() {
    setSelectedNodeId(null);
  }

  if (learningPaths.length === 0) {
    return (
      <Card className='border-zinc-200 bg-white shadow-sm'>
        <CardContent className='p-4 sm:p-5'>
          <p className='text-sm font-semibold text-zinc-950'>
            No learning path found
          </p>

          <p className='mt-1 max-w-2xl text-sm leading-6 text-zinc-500'>
            We couldn&apos;t find a prerequisite path from your selected skills
            to the missing requirements for this role.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='overflow-hidden border-zinc-200 bg-white shadow-sm'>
      {/* Graph header */}
      <div className='border-b border-zinc-200 px-4 py-3.5 sm:px-5 sm:py-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='min-w-0'>
            <h3 className='text-sm font-semibold text-zinc-950'>
              Interactive learning graph
            </h3>

            <p className='mt-1 max-w-xl text-xs leading-5 text-zinc-500'>
              Follow the arrows from skills you know toward skills you need to
              develop. Drag nodes or select one to inspect its direct
              connections.
            </p>
          </div>

          {/* Legend */}
          <div className='flex shrink-0 flex-wrap gap-x-3 gap-y-2 text-[11px] text-zinc-600 sm:gap-x-4 sm:text-xs'>
            <div className='flex items-center gap-1.5'>
              <span className='size-2.5 rounded-full bg-emerald-500' />
              Known
            </div>

            <div className='flex items-center gap-1.5'>
              <span className='size-2.5 rounded-full bg-indigo-500' />
              Learning step
            </div>

            <div className='flex items-center gap-1.5'>
              <span className='size-2.5 rounded-full bg-amber-500' />
              Missing
            </div>
          </div>
        </div>
      </div>

      {/* Graph canvas */}
      <div className='h-80 w-full sm:h-100 lg:h-120'>
        <ReactFlow<SkillFlowNode>
          nodes={displayNodes}
          edges={displayEdges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onNodeClick={(_event, node) => {
            setSelectedNodeId(node.id);
          }}
          onPaneClick={clearSelection}
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
        >
          <Background gap={22} size={1} color='#e4e4e7' />

          <Controls position='bottom-left' showInteractive={false} />
        </ReactFlow>
      </div>

      {/* Selected node details */}
      {selectedNode && (
        <div className='border-t border-zinc-200 bg-zinc-50/60 px-3 py-2.5 sm:px-4 sm:py-3'>
          <div className='flex items-start gap-2.5 sm:gap-3'>
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-1.5 sm:gap-2'>
                <p className='text-sm font-semibold text-zinc-950'>
                  {selectedNode.data.label}
                </p>

                <span
                  className={
                    selectedNode.data.status === 'known'
                      ? 'rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700'
                      : selectedNode.data.status === 'missing'
                        ? 'rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700'
                        : 'rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700'
                  }
                >
                  {selectedNode.data.status === 'known'
                    ? 'Known'
                    : selectedNode.data.status === 'missing'
                      ? 'Missing'
                      : 'Learning step'}
                </span>

                <span className='text-[11px] text-zinc-400 sm:text-xs'>
                  {selectedNode.data.category}
                </span>

                <span className='text-[11px] capitalize text-zinc-400 sm:text-xs'>
                  · {selectedNode.data.level}
                </span>
              </div>

              <p className='mt-1 line-clamp-2 max-w-4xl text-xs leading-5 text-zinc-600'>
                {selectedNode.data.description}
              </p>
            </div>

            <Button
              type='button'
              variant='ghost'
              size='icon'
              className='size-7 shrink-0 text-zinc-400 hover:text-zinc-900'
              onClick={clearSelection}
              aria-label='Close skill details'
            >
              <X className='size-3.5' />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
