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

async function verifyTraversal() {
  try {
    await driver.verifyConnectivity();

    const result = await driver.executeQuery(
      `
        MATCH path =
          (start:Skill {slug: $startSkill})
          -[:PREREQUISITE_OF*2..4]->
          (target:Skill)

        RETURN
          [node IN nodes(path) | node.name] AS path,
          length(path) AS hops

        ORDER BY hops, path
      `,
      {
        startSkill: 'javascript',
      },
    );

    if (result.records.length === 0) {
      console.log('No multi-hop paths found.');
      return;
    }

    console.log('Multi-hop paths from JavaScript:');

    for (const record of result.records) {
      console.log({
        hops: record.get('hops').toNumber(),
        path: record.get('path'),
      });
    }
  } catch (error) {
    console.error('Traversal verification failed:', error);
    process.exitCode = 1;
  } finally {
    await driver.close();
  }
}

verifyTraversal();
