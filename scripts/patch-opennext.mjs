import fs from "fs";
import path from "path";

const targetFiles = [
  path.join(process.cwd(), ".open-next/server-functions/default/handler.mjs"),
  path.join(process.cwd(), ".open-next/worker.js")
];

for (const file of targetFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, "utf8");
    const target = 'function install(){{debug2?.("installing fast setImmediate patch");let nodeTimers=require("node:timers");globalThis.setImmediate=nodeTimers.setImmediate=patchedSetImmediate,globalThis.clearImmediate=nodeTimers.clearImmediate=patchedClearImmediate;let nodeTimersPromises=require("node:timers/promises");nodeTimersPromises.setImmediate=patchedSetImmediatePromise,process.nextTick=patchedNextTick}}';
    const replacement = 'function install(){try{globalThis.setImmediate=patchedSetImmediate;globalThis.clearImmediate=patchedClearImmediate;process.nextTick=patchedNextTick;}catch(e){}}';
    
    if (content.includes(target)) {
      content = content.replaceAll(target, replacement);
      fs.writeFileSync(file, content, "utf8");
      console.log(`[patch] Patched ${file} successfully`);
    }
  }
}
