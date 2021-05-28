
const ctx: Worker = self as any;

onmessage = (ev) => {
  postMessage(ev.data);
};

