
import EchoWorker from './echo_onmessage_js.worker';

describe('EchoWorker', () => {
  it('can execute WebWorker', async () => {
    const worker = new EchoWorker();
    await new Promise((resolve, reject) => {
      worker.onmessage = (ev) => {
        expect(ev.data).toBe('Hello world!');
        resolve();
      };
      worker.postMessage('Hello world!');
    });
  });
});

