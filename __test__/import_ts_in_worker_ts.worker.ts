
import { echoback } from './import_ts_in_worker_ts.lib';

const ctx: Worker = self as any;

ctx.addEventListener('message', (ev) => {
  ctx.postMessage(echoback(ev.data));
});

