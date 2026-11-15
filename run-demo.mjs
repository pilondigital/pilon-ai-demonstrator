import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {runModule,materializeProject} from './agents.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
async function main() {
  const args=process.argv.slice(2);
  if(args.length && !(args.length===2 && args[0]==='--env-file')) throw new Error('Usage: node run-demo.mjs [--env-file PATH]');
  let key=process.env.OPENAI_API_KEY;
  if(args.length) {
    const file=await readFile(args[1],'utf8');
    const match=file.match(/^\s*OPENAI_API_KEY\s*=\s*(.*?)\s*$/m);
    key=match?.[1]?.replace(/^(["'])(.*)\1$/,'$2');
  }
  const fixtures=JSON.parse(await readFile(path.join(root,'fixtures.json'),'utf8'));
  const hashes={};
  for(const name of ['agents.mjs','run-demo.mjs','fixtures.json']) hashes[name]=createHash('sha256').update(await readFile(path.join(root,name))).digest('hex');
  const report={project:'Pilon AI Demonstrator',version:'0.1.0',generated_at:new Date().toISOString(),notice:fixtures.notice,source_sha256:hashes,runs:[]};
  for(const [name,data] of [
    ['quote',{request:fixtures.client_request,catalogue:fixtures.catalogue}],
    ['documents',{question:fixtures.question,documents:fixtures.documents}],
    ['workflow',{request:fixtures.workflow_request,client_request:fixtures.client_request}]
  ]) {
    const run=await runModule(name,data,{apiKey:key,model:process.env.OPENAI_MODEL||'gpt-6-luna'});
    report.runs.push(run);
    console.log(`${name}: live request completed and output validated`);
  }
  // This is an isolated fixture simulation. No real client project is created.
  report.automation_simulation={notice:'Test fixture approved by the demo harness; local JSON only.',project:materializeProject(report.runs[2].result,{approved:true})};
  await mkdir(path.join(root,'evidence'),{recursive:true});
  await writeFile(path.join(root,'evidence','live-run.json'),JSON.stringify(report,null,2)+'\n');
  console.log('Evidence saved to evidence/live-run.json');
}
main().catch(error=>{console.error(error.message.replace(/sk-[A-Za-z0-9_-]+/g,'[redacted]'));process.exitCode=1;});
