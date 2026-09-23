import fs from 'node:fs';import path from 'node:path';
const root=process.cwd(),out=path.join(root,'dist');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
for(const item of ['index.html','src'])fs.cpSync(path.join(root,item),path.join(out,item),{recursive:true});
fs.writeFileSync(path.join(out,'build.json'),JSON.stringify({name:'ForgePath',version:'4.0.0',target:'web',builtAt:new Date().toISOString()},null,2));
console.log('ForgePath V4.0 Web built -> dist/');
