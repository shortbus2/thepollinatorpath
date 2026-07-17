import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(process.argv[2]||'.');
const files=fs.readdirSync(root).filter(x=>x.endsWith('.html'));
const missing=[];
for(const file of files){
 const text=fs.readFileSync(path.join(root,file),'utf8');
 for(const match of text.matchAll(/href=["']([^"'#?]+)(?:[?#][^"']*)?["']/g)){
  const href=match[1];
  if(/^(https?:|mailto:|tel:|javascript:)/.test(href))continue;
  const target=path.resolve(root,path.dirname(file),href);
  if(!fs.existsSync(target))missing.push(`${file} -> ${href}`);
 }
}
if(missing.length){console.error('Broken static links:\n'+missing.join('\n'));process.exit(1)}
console.log(`Link audit passed across ${files.length} HTML files.`);
