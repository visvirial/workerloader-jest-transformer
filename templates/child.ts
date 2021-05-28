
import { TransferListItem, isMainThread, parentPort } from 'worker_threads';

/* {% WORKER_IMPORTS %} */

export type ListenerFunction = (ev: { data: unknown }) => void;
export type ListenerFunctionNode = (data: unknown) => void;

if(isMainThread) process.exit(0);
if(parentPort === null) throw new Error('"worker_threads/parentPort" is not available.');

export class ListenerData {
	public listenerNode: ListenerFunctionNode;
	constructor(public listener: ListenerFunction) {
		this.listenerNode = (data) => {
			listener({ data });
		};
	}
}

const self = {
	listeners: [] as ListenerData[],
	addEventListener: (event: string, listener: ListenerFunction) => {
		const l = new ListenerData(listener);
		self.listeners.push(l);
		return parentPort!.addListener(event, l.listenerNode);
	},
	removeEventListener: (event: string | symbol, listener: ListenerFunction) => {
		for(let i=0; i<self.listeners.length; i++) {
			if(self.listeners[i].listener == listener) {
				const ret = parentPort!.removeListener(event, self.listeners[i].listenerNode);
				self.listeners.splice(i, 1);
				return ret;
			}
		}
	},
	postMessage: (data: unknown, transfer?: TransferListItem[]) => parentPort!.postMessage(data, transfer),
	onmessage: null as ListenerFunction | null,
};

const postMessage = self.postMessage;
let onmessage: ListenerFunction | null = null;

self.addEventListener('message', (ev) => {
	if(onmessage) {
		onmessage(ev);
	}
	if(self.onmessage) {
		self.onmessage(ev);
	}
});

/* {% WORKER_CODE %} */

