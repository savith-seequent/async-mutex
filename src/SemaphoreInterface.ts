interface SemaphoreInterface {
    acquire(weight?: number, priority?: number, name?: string): Promise<[number, SemaphoreInterface.Releaser]>;

    runExclusive<T>(callback: SemaphoreInterface.Worker<T>, weight?: number, priority?: number): Promise<T>;

    waitForUnlock(weight?: number, priority?: number, name?: string): Promise<void>;

    isLocked(): boolean;

    getValue(): number;

    setValue(value: number): void;

    release(weight?: number, name?: string): void;

    cancel(): void;

    printQueue(): void;
}

namespace SemaphoreInterface {
    export interface Releaser {
        (): void;
    }

    export interface Worker<T> {
        (value: number): Promise<T> | T;
    }
}

export default SemaphoreInterface;
