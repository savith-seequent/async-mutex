interface MutexInterface {
    acquire(priority?: number, name?: string): Promise<MutexInterface.Releaser>;

    runExclusive<T>(callback: MutexInterface.Worker<T>, priority?: number): Promise<T>;

    waitForUnlock(priority?: number, name?: string): Promise<void>;

    isLocked(): boolean;

    release(name?: string): void;

    cancel(): void;

    printQueue(): void;
}

namespace MutexInterface {
    export interface Releaser {
        (): void;
    }

    export interface Worker<T> {
        (): Promise<T> | T;
    }
}

export default MutexInterface;

export interface SimpleMutexInterface {
    acquire(name: string): Promise<MutexInterface.Releaser>;

    waitForUnlock(name: string, priority?: number): Promise<void>;

    release(name: string): void;
}
