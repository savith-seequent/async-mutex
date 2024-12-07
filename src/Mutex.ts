import MutexInterface from './MutexInterface';
import Semaphore from './Semaphore';

class Mutex implements MutexInterface {
    constructor(cancelError?: Error) {
        this._semaphore = new Semaphore(1, cancelError);
    }

    async acquire(priority = 0, name?: string): Promise<MutexInterface.Releaser> {
        const [, releaser] = await this._semaphore.acquire(1, priority, name);

        return releaser;
    }

    runExclusive<T>(callback: MutexInterface.Worker<T>, priority = 0): Promise<T> {
        return this._semaphore.runExclusive(() => callback(), 1, priority);
    }

    isLocked(): boolean {
        return this._semaphore.isLocked();
    }

    waitForUnlock(priority = 0, name?: string): Promise<void> {
        return this._semaphore.waitForUnlock(1, priority, name);
    }

    release(name?: string): void {
        if (this._semaphore.isLocked()) this._semaphore.release(undefined, name);
    }

    cancel(): void {
        return this._semaphore.cancel();
    }

    printQueue(): void {
        this._semaphore.printQueue();
    }

    private _semaphore: Semaphore;
}

export default Mutex;

// interface QueueEntry {
//     name: string;
//     resolve(result: [number, SemaphoreInterface.Releaser]): void;
//     reject(error: unknown): void;
//     weight: number;
//     priority: number;
// }

// interface Waiter {
//     name: string;
//     resolve(): void;
//     priority: number;
// }
//
// export class SimpleMutex implements SimpleMutexInterface {
//     constructor(
//         private _value: number,
//         private _startTime = Date.now(),
//     ) {}
//
//     acquire(name: string): Promise<MutexInterface.Releaser> {
//         console.log(Date.now() - this._startTime, '[ACQUIRE]', name);
//
//         return new Promise((resolve, reject) => {
//             const task: QueueEntry = { name, resolve, reject, weight, priority };
//             const i = findIndexFromEnd(this._queue, (other) => priority <= other.priority);
//             if (i === -1 && weight <= this._value) {
//                 // Needs immediate dispatch, skip the queue
//                 this._dispatchItem(task);
//             } else {
//                 this._queue.splice(i + 1, 0, task);
//                 console.log(
//                     '[QUEUE]',
//                     this._queue.map((entry) => entry.name),
//                 );
//             }
//             console.log('[IS_LOCKED]', this.isLocked());
//         });
//     }
// }
//
// function insertSorted<T extends Priority>(a: T[], v: T) {
//     const i = findIndexFromEnd(a, (other) => v.priority <= other.priority);
//     a.splice(a.length, 0, v);
// }
//
// function findIndexFromEnd<T>(a: T[], predicate: (e: T) => boolean): number {
//     for (let i = a.length - 1; i >= 0; i--) {
//         if (predicate(a[i])) {
//             return i;
//         }
//     }
//     return -1;
// }
