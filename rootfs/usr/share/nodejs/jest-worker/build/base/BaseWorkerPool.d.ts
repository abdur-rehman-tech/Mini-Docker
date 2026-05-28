/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import { PoolExitResult, WorkerInterface, WorkerOptions, WorkerPoolOptions } from '../types';
export default class BaseWorkerPool {
    private readonly _stderr;
    private readonly _stdout;
    protected readonly _options: WorkerPoolOptions;
    private readonly _workers;
    private readonly _workerPath;
    constructor(workerPath: string, options: WorkerPoolOptions);
    getStderr(): NodeJS.ReadableStream;
    getStdout(): NodeJS.ReadableStream;
    getWorkers(): Array<WorkerInterface>;
    getWorkerById(workerId: number): WorkerInterface;
    restartWorkerIfShutDown(workerId: number): void;
    createWorker(_workerOptions: WorkerOptions): WorkerInterface;
    start(): Promise<void>;
    end(): Promise<PoolExitResult>;
}
