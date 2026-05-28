/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { QueueChildMessage, TaskQueue } from './types';
export type ComputeTaskPriorityCallback = (method: string, ...args: Array<unknown>) => number;
type QueueItem = {
    task: QueueChildMessage;
    priority: number;
};
/**
 * Priority queue that processes tasks in natural ordering (lower priority first)
 * according to the priority computed by the function passed in the constructor.
 *
 * FIFO ordering isn't guaranteed for tasks with the same priority.
 *
 * Worker specific tasks with the same priority as a non-worker specific task
 * are always processed first.
 */
export default class PriorityQueue implements TaskQueue {
    private readonly _computePriority;
    private _queue;
    private readonly _sharedQueue;
    constructor(_computePriority: ComputeTaskPriorityCallback);
    enqueue(task: QueueChildMessage, workerId?: number): void;
    _enqueue(task: QueueChildMessage, queue: MinHeap<QueueItem>): void;
    dequeue(workerId: number): QueueChildMessage | null;
    _getWorkerQueue(workerId: number): MinHeap<QueueItem>;
}
type HeapItem = {
    priority: number;
};
declare class MinHeap<TItem extends HeapItem> {
    private readonly _heap;
    peek(): TItem | null;
    add(item: TItem): void;
    poll(): TItem | null;
}
export {};
