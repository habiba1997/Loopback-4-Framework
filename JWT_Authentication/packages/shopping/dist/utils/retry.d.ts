/// <reference types="node" />
export interface TaskStatus<T> {
    done: boolean;
    value?: T | null;
}
/**
 * A task that can be retried
 */
export interface Task<T> {
    run(): Promise<TaskStatus<T>>;
    description: string;
}
/**
 * Options for retry
 */
export interface RetryOptions {
    /**
     * Maximum number of tries including the first run.
     */
    maxTries?: number;
    /**
     * Milliseconds to wait after each try
     */
    interval?: number;
}
/**
 * Retry a task for number of times with the given interval in ms
 * @param task Task object {run, description}
 * @param maxTries Maximum number of tries (including the first run),
 * default to 10
 * @param interval Milliseconds to wait after each try, default to 100ms
 */
export declare function retry<T>(task: Task<T>, { maxTries, interval }?: RetryOptions): Promise<T>;
/**
 * Sleep for the given milliseconds
 * @param ms Number of milliseconds to wait
 */
export declare const sleep: typeof setTimeout.__promisify__;
