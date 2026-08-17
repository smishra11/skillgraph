import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';

import {
  prerequisites,
  relatedSkills,
  roleRequirements,
  roles,
  skills,
} from '../lib/db/seed-data';

dotenv.config({ path: '.env.local' });

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error('Missing CognoDB environment variables.');
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

async function seed() {
  try {
    console.log('Connecting to CognoDB...');

    await driver.verifyConnectivity();

    console.log('Connected.');

    await driver.executeQuery(`
      CREATE CONSTRAINT skill_id_unique IF NOT EXISTS
      FOR (skill:Skill)
      REQUIRE skill.id IS UNIQUE
    `);

    await driver.executeQuery(`
      CREATE CONSTRAINT role_id_unique IF NOT EXISTS
      FOR (role:Role)
      REQUIRE role.id IS UNIQUE
    `);

    await driver.executeQuery(
      `
        UNWIND $skills AS skill

        MERGE (node:Skill {id: skill.id})

        SET
          node.name = skill.name,
          node.slug = skill.slug,
          node.category = skill.category,
          node.level = skill.level,
          node.description = skill.description
      `,
      {
        skills,
      },
    );

    await driver.executeQuery(
      `
        UNWIND $roles AS role

        MERGE (node:Role {id: role.id})

        SET
          node.name = role.name,
          node.slug = role.slug,
          node.level = role.level,
          node.description = role.description
      `,
      {
        roles,
      },
    );

    await driver.executeQuery(
      `
        UNWIND $requirements AS requirement

        MATCH (role:Role {slug: requirement[0]})
        MATCH (skill:Skill {slug: requirement[1]})

        MERGE (role)-[relationship:REQUIRES]->(skill)

        SET relationship.importance = requirement[2]
      `,
      {
        requirements: roleRequirements,
      },
    );

    await driver.executeQuery(
      `
        UNWIND $prerequisites AS prerequisite

        MATCH (source:Skill {slug: prerequisite[0]})
        MATCH (target:Skill {slug: prerequisite[1]})

        MERGE (source)-[:PREREQUISITE_OF]->(target)
      `,
      {
        prerequisites,
      },
    );

    await driver.executeQuery(
      `
        UNWIND $relationships AS relationship

        MATCH (source:Skill {slug: relationship[0]})
        MATCH (target:Skill {slug: relationship[1]})

        MERGE (source)-[:RELATED_TO]->(target)
      `,
      {
        relationships: relatedSkills,
      },
    );

    console.log('SkillGraph seed completed successfully.');
  } catch (error) {
    console.error('Failed to seed SkillGraph:', error);

    process.exitCode = 1;
  } finally {
    await driver.close();
  }
}

seed();
