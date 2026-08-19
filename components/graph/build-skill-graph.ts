import { MarkerType, type Edge, type Node } from '@xyflow/react';
import type { LearningPath, Skill } from '@/lib/db/queries';
import type { SkillNodeData, SkillNodeStatus } from './skill-node';

export type SkillGraphBuildResult = {
  nodes: Node<SkillNodeData>[];
  edges: Edge[];
};

export function buildSkillGraph(
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
