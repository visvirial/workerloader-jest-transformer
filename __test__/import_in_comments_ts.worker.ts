
// import nosuchmodule from 'nosuchmodule';

/*
import nosuchmodule from 'nosuchmodule';
*/

const ctx: Worker = self as any;

ctx.addEventListener('message', (ev) => {
  ctx.postMessage(ev.data);
});

