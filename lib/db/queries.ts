import driver from '@/lib/db/driver';

export type Role = {
  id: string;
  name: string;
  slug: string;
  level: string;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  slug: string;
  category: string;
  level: string;
  description: string;
};

export type RoleRequirement = {
  skill: Skill;
  importance: number;
};

export type SkillGapItem = {
  skill: Skill;
  importance: number;
};

export type SkillGapAnalysis = {
  role: Role;
  matchPercentage: number;
  matchedWeight: number;
  totalWeight: number;
  matchedSkills: SkillGapItem[];
  missingSkills: SkillGapItem[];
};

export type LearningPath = {
  fromSkill: Skill;
  toSkill: Skill;
  hops: number;
  path: Skill[];
};

export async function getRoles(): Promise<Role[]> {
  const result = await driver.executeQuery(`
    MATCH (role:Role)

    RETURN
      role.id AS id,
      role.name AS name,
      role.slug AS slug,
      role.level AS level,
      role.description AS description

    ORDER BY role.name
  `);

  return result.records.map((record) => ({
    id: record.get('id'),
    name: record.get('name'),
    slug: record.get('slug'),
    level: record.get('level'),
    description: record.get('description'),
  }));
}

export async function getSkills(): Promise<Skill[]> {
  const result = await driver.executeQuery(`
    MATCH (skill:Skill)

    RETURN
      skill.id AS id,
      skill.name AS name,
      skill.slug AS slug,
      skill.category AS category,
      skill.level AS level,
      skill.description AS description

    ORDER BY skill.category, skill.name
  `);

  return result.records.map((record) => ({
    id: record.get('id'),
    name: record.get('name'),
    slug: record.get('slug'),
    category: record.get('category'),
    level: record.get('level'),
    description: record.get('description'),
  }));
}

export async function getRoleRequirements(
  roleSlug: string,
): Promise<RoleRequirement[]> {
  const result = await driver.executeQuery(
    `
      MATCH (role:Role {slug: $roleSlug})
        -[requirement:REQUIRES]->
        (skill:Skill)

      RETURN
        skill.id AS id,
        skill.name AS name,
        skill.slug AS slug,
        skill.category AS category,
        skill.level AS level,
        skill.description AS description,
        requirement.importance AS importance

      ORDER BY requirement.importance DESC, skill.name
    `,
    {
      roleSlug,
    },
  );

  return result.records.map((record) => ({
    skill: {
      id: record.get('id'),
      name: record.get('name'),
      slug: record.get('slug'),
      category: record.get('category'),
      level: record.get('level'),
      description: record.get('description'),
    },
    importance: Number(record.get('importance')),
  }));
}

export async function analyzeSkillGap(
  roleSlug: string,
  selectedSkillSlugs: string[],
): Promise<SkillGapAnalysis | null> {
  const result = await driver.executeQuery(
    `
      MATCH (role:Role {slug: $roleSlug})
      MATCH (role)-[requirement:REQUIRES]->(skill:Skill)

      WITH
        role,
        skill,
        requirement,
        skill.slug IN $selectedSkillSlugs AS isMatched

      RETURN
        role.id AS roleId,
        role.name AS roleName,
        role.slug AS roleSlug,
        role.level AS roleLevel,
        role.description AS roleDescription,

        skill.id AS skillId,
        skill.name AS skillName,
        skill.slug AS skillSlug,
        skill.category AS skillCategory,
        skill.level AS skillLevel,
        skill.description AS skillDescription,

        requirement.importance AS importance,
        isMatched

      ORDER BY requirement.importance DESC, skill.name
    `,
    {
      roleSlug,
      selectedSkillSlugs,
    },
  );

  if (result.records.length === 0) {
    return null;
  }

  const firstRecord = result.records[0];

  const role: Role = {
    id: firstRecord.get('roleId'),
    name: firstRecord.get('roleName'),
    slug: firstRecord.get('roleSlug'),
    level: firstRecord.get('roleLevel'),
    description: firstRecord.get('roleDescription'),
  };

  const matchedSkills: SkillGapItem[] = [];
  const missingSkills: SkillGapItem[] = [];

  let matchedWeight = 0;
  let totalWeight = 0;

  for (const record of result.records) {
    const importance = Number(record.get('importance'));
    const isMatched = Boolean(record.get('isMatched'));

    const item: SkillGapItem = {
      skill: {
        id: record.get('skillId'),
        name: record.get('skillName'),
        slug: record.get('skillSlug'),
        category: record.get('skillCategory'),
        level: record.get('skillLevel'),
        description: record.get('skillDescription'),
      },
      importance,
    };

    totalWeight += importance;

    if (isMatched) {
      matchedWeight += importance;
      matchedSkills.push(item);
    } else {
      missingSkills.push(item);
    }
  }

  const matchPercentage =
    totalWeight === 0 ? 0 : Math.round((matchedWeight / totalWeight) * 100);

  return {
    role,
    matchPercentage,
    matchedWeight,
    totalWeight,
    matchedSkills,
    missingSkills,
  };
}

export async function getLearningPaths(
  roleSlug: string,
  selectedSkillSlugs: string[],
): Promise<LearningPath[]> {
  const result = await driver.executeQuery(
    `
      MATCH (role:Role {slug: $roleSlug})
        -[:REQUIRES]->
        (missingSkill:Skill)

      WHERE NOT missingSkill.slug IN $selectedSkillSlugs

      MATCH path =
        (knownSkill:Skill)
        -[:PREREQUISITE_OF*1..4]->
        (missingSkill)

      WHERE knownSkill.slug IN $selectedSkillSlugs

      RETURN
        knownSkill.id AS fromSkillId,
        knownSkill.name AS fromSkillName,
        knownSkill.slug AS fromSkillSlug,
        knownSkill.category AS fromSkillCategory,
        knownSkill.level AS fromSkillLevel,
        knownSkill.description AS fromSkillDescription,

        missingSkill.id AS toSkillId,
        missingSkill.name AS toSkillName,
        missingSkill.slug AS toSkillSlug,
        missingSkill.category AS toSkillCategory,
        missingSkill.level AS toSkillLevel,
        missingSkill.description AS toSkillDescription,

        length(path) AS hops,

        [node IN nodes(path) | node.id] AS pathIds,
        [node IN nodes(path) | node.name] AS pathNames,
        [node IN nodes(path) | node.slug] AS pathSlugs,
        [node IN nodes(path) | node.category] AS pathCategories,
        [node IN nodes(path) | node.level] AS pathLevels,
        [node IN nodes(path) | node.description] AS pathDescriptions

      ORDER BY hops ASC, toSkillName ASC
    `,
    {
      roleSlug,
      selectedSkillSlugs,
    },
  );

  return result.records.map((record) => {
    const pathIds = record.get('pathIds') as string[];
    const pathNames = record.get('pathNames') as string[];
    const pathSlugs = record.get('pathSlugs') as string[];
    const pathCategories = record.get('pathCategories') as string[];
    const pathLevels = record.get('pathLevels') as string[];
    const pathDescriptions = record.get('pathDescriptions') as string[];

    const path: Skill[] = pathIds.map((id, index) => ({
      id,
      name: pathNames[index],
      slug: pathSlugs[index],
      category: pathCategories[index],
      level: pathLevels[index],
      description: pathDescriptions[index],
    }));

    return {
      fromSkill: {
        id: record.get('fromSkillId'),
        name: record.get('fromSkillName'),
        slug: record.get('fromSkillSlug'),
        category: record.get('fromSkillCategory'),
        level: record.get('fromSkillLevel'),
        description: record.get('fromSkillDescription'),
      },
      toSkill: {
        id: record.get('toSkillId'),
        name: record.get('toSkillName'),
        slug: record.get('toSkillSlug'),
        category: record.get('toSkillCategory'),
        level: record.get('toSkillLevel'),
        description: record.get('toSkillDescription'),
      },
      hops: Number(record.get('hops')),
      path,
    };
  });
}
