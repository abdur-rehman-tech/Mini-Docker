/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import type { QueueChildMessage, TaskQueue } from './types';
/**
 * First-in, First-out task queue that manages a dedicated pool
 * for each worker as well as a shared queue. The FIFO ordering is guaranteed
 * across the worker specific and shared queue.
 */
export default class FifoQueue implements TaskQueue {
    private _workerQueues;
    private readonly _sharedQueue;
    enqueue(task: QueueChildMessage, workerId?: number): void;
    dequeue(workerId: number): QueueChildMessage | null;
}
