import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';

dotenv.config({ path: '.env.local' });

const uri = process.env.COGNODB_URI;
const username = process.env.COGNODB_USERNAME;
const password = process.env.COGNODB_PASSWORD;

if (!uri || !username || !password) {
  throw new Error('Missing CognoDB environment variables.');
}

const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

async function verifySeed() {
  try {
    await driver.verifyConnectivity();

    const result = await driver.executeQuery(`
      MATCH (skill:Skill)
      WITH count(skill) AS skillCount

      MATCH (role:Role)
      WITH skillCount, count(role) AS roleCount

      MATCH ()-[requires:REQUIRES]->()
      WITH skillCount, roleCount, count(requires) AS requiresCount

      MATCH ()-[prerequisite:PREREQUISITE_OF]->()
      WITH
        skillCount,
        roleCount,
        requiresCount,
        count(prerequisite) AS prerequisiteCount

      MATCH ()-[related:RELATED_TO]->()

      RETURN
        skillCount,
        roleCount,
        requiresCount,
        prerequisiteCount,
        count(related) AS relatedCount
    `);

    const record = result.records[0];

    console.log({
      skills: record.get('skillCount').toNumber(),
      roles: record.get('roleCount').toNumber(),
      requires: record.get('requiresCount').toNumber(),
      prerequisites: record.get('prerequisiteCount').toNumber(),
      related: record.get('relatedCount').toNumber(),
    });
  } catch (error) {
    console.error('Seed verification failed:', error);
    process.exitCode = 1;
  } finally {
    await driver.close();
  }
}

verifySeed();
