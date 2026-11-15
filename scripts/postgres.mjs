import EmbeddedPostgres from 'embedded-postgres';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { randomBytes } from 'node:crypto';

export async function startPostgres(kind, port) {
  if (!['dev','test'].includes(kind)) throw new Error('Jenis database tidak valid.');
  const root = resolve('.local',kind);
  await mkdir(root,{recursive:true});
  const credentialsPath = join(root,'credentials.json');
  let credentials;
  try { credentials = JSON.parse(await readFile(credentialsPath,'utf8')); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    credentials = {user:'uas',password:randomBytes(24).toString('hex')};
    await writeFile(credentialsPath,JSON.stringify(credentials),{mode:0o600,flag:'wx'});
  }
  const databaseDir = join(root,'pgdata');
  const messages = [];
  const postgres = new EmbeddedPostgres({databaseDir,port,...credentials,persistent:true,
    autoRehydrateSymlinks:true,initdbFlags:['--encoding=UTF8','--locale=C'],
    postgresFlags:['-h','127.0.0.1','-c','max_connections=60'],
    onLog:message => messages.push(String(message)),onError:message => messages.push(String(message)),
  });
  try {
    let initialized = false;
    try { await access(join(databaseDir,'PG_VERSION')); initialized = true; } catch {}
    if (!initialized) await postgres.initialise();
    await postgres.start();
  } catch (error) {
    console.error(messages.join('\n').replaceAll(credentials.password,'[redacted]'));
    throw error;
  }
  return {postgres, url:database => `postgresql://${credentials.user}:${credentials.password}@127.0.0.1:${port}/${database}`};
}
