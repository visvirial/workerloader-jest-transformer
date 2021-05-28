
import { TransferListItem, isMainThread, parentPort } from 'worker_threads';

/* {% WORKER_IMPORTS %} */

if(isMainThread) process.exit(0);
if(parentPort === null) throw new Error('"worker_threads/parentPort" is not available.');

export class ListenerData {
	listener;
	listenerNode;
	constructor(listener) {
		this.listener = listener;
		this.listenerNode = (data) => {
			listener({ data });
		};
	}
}

const self = {
	listeners: [],
	addEventListener: (event, listener) => {
		const l = new ListenerData(listener);
		self.listeners.push(l);
		return parentPort.addListener(event, l.listenerNode);
	},
	removeEventListener: (event, listener) => {
		for(let i=0; i<self.listeners.length; i++) {
			if(self.listeners[i].listener == listener) {
				const ret = parentPort.removeListener(event, self.listeners[i].listenerNode);
				self.listeners.splice(i, 1);
				return ret;
			}
		}
	},
	postMessage: (data, transfer) => parentPort.postMessage(data, transfer),
	onmessage: null,
};

const postMessage = self.postMessage;
let onmessage = null;

self.addEventListener('message', (ev) => {
	if(onmessage) {
		onmessage(ev);
	}
	if(self.onmessage) {
		self.onmessage(ev);
	}
});

/* {% WORKER_CODE %} */

