/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="node" />
import type * as Global from './Global';
type Process = NodeJS.Process;
export type DoneFn = Global.DoneFn;
export type BlockFn = Global.BlockFn;
export type BlockName = Global.BlockName;
export type BlockNameLike = Global.BlockNameLike;
export type BlockMode = void | 'skip' | 'only' | 'todo';
export type TestMode = BlockMode;
export type TestName = Global.TestName;
export type TestNameLike = Global.TestNameLike;
export type TestFn = Global.TestFn;
export type ConcurrentTestFn = Global.ConcurrentTestFn;
export type HookFn = Global.HookFn;
export type AsyncFn = TestFn | HookFn;
export type SharedHookType = 'afterAll' | 'beforeAll';
export type HookType = SharedHookType | 'afterEach' | 'beforeEach';
export type TestContext = Global.TestContext;
export type Exception = any;
export type FormattedError = string;
export type Hook = {
    asyncError: Error;
    fn: HookFn;
    type: HookType;
    parent: DescribeBlock;
    seenDone: boolean;
    timeout: number | undefined | null;
};
export interface EventHandler {
    (event: AsyncEvent, state: State): void | Promise<void>;
    (event: SyncEvent, state: State): void;
}
export type Event = SyncEvent | AsyncEvent;
interface JestGlobals extends Global.TestFrameworkGlobals {
    expect: unknown;
}
export type SyncEvent = {
    asyncError: Error;
    mode: BlockMode;
    name: 'start_describe_definition';
    blockName: BlockName;
} | {
    mode: BlockMode;
    name: 'finish_describe_definition';
    blockName: BlockName;
} | {
    asyncError: Error;
    name: 'add_hook';
    hookType: HookType;
    fn: HookFn;
    timeout: number | undefined;
} | {
    asyncError: Error;
    name: 'add_test';
    testName: TestName;
    fn: TestFn;
    mode?: TestMode;
    concurrent: boolean;
    timeout: number | undefined;
    failing: boolean;
} | {
    name: 'error';
    error: Exception;
};
export type AsyncEvent = {
    name: 'setup';
    testNamePattern?: string;
    runtimeGlobals: JestGlobals;
    parentProcess: Process;
} | {
    name: 'include_test_location_in_result';
} | {
    name: 'hook_start';
    hook: Hook;
} | {
    name: 'hook_success';
    describeBlock?: DescribeBlock;
    test?: TestEntry;
    hook: Hook;
} | {
    name: 'hook_failure';
    error: string | Exception;
    describeBlock?: DescribeBlock;
    test?: TestEntry;
    hook: Hook;
} | {
    name: 'test_fn_start';
    test: TestEntry;
} | {
    name: 'test_fn_success';
    test: TestEntry;
} | {
    name: 'test_fn_failure';
    error: Exception;
    test: TestEntry;
} | {
    name: 'test_retry';
    test: TestEntry;
} | {
    name: 'test_start';
    test: TestEntry;
} | {
    name: 'test_skip';
    test: TestEntry;
} | {
    name: 'test_todo';
    test: TestEntry;
} | {
    name: 'test_started';
    test: TestEntry;
} | {
    name: 'test_done';
    test: TestEntry;
} | {
    name: 'run_describe_start';
    describeBlock: DescribeBlock;
} | {
    name: 'run_describe_finish';
    describeBlock: DescribeBlock;
} | {
    name: 'run_start';
} | {
    name: 'run_finish';
} | {
    name: 'teardown';
};
export type MatcherResults = {
    actual: unknown;
    expected: unknown;
    name: string;
    pass: boolean;
};
export type TestStatus = 'skip' | 'done' | 'todo';
export type TestNamesPath = Array<TestName | BlockName>;
export type TestCaseStartInfo = {
    ancestorTitles: Array<string>;
    fullName: string;
    mode: TestMode;
    title: string;
    startedAt?: number | null;
};
export type TestResult = {
    duration?: number | null;
    errors: Array<FormattedError>;
    errorsDetailed: Array<MatcherResults | unknown>;
    invocations: number;
    status: TestStatus;
    location?: {
        column: number;
        line: number;
    } | null;
    numPassingAsserts: number;
    retryReasons: Array<FormattedError>;
    testPath: TestNamesPath;
};
export type RunResult = {
    unhandledErrors: Array<FormattedError>;
    testResults: TestResults;
};
export type TestResults = Array<TestResult>;
export type GlobalErrorHandlers = {
    uncaughtException: Array<(exception: Exception) => void>;
    unhandledRejection: Array<(exception: Exception, promise: Promise<unknown>) => void>;
};
export type State = {
    currentDescribeBlock: DescribeBlock;
    currentlyRunningTest?: TestEntry | null;
    expand?: boolean;
    hasFocusedTests: boolean;
    hasStarted: boolean;
    originalGlobalErrorHandlers?: GlobalErrorHandlers;
    parentProcess: Process | null;
    randomize?: boolean;
    rootDescribeBlock: DescribeBlock;
    seed: number;
    testNamePattern?: RegExp | null;
    testTimeout: number;
    unhandledErrors: Array<Exception>;
    includeTestLocationInResult: boolean;
    maxConcurrency: number;
};
export type DescribeBlock = {
    type: 'describeBlock';
    children: Array<DescribeBlock | TestEntry>;
    hooks: Array<Hook>;
    mode: BlockMode;
    name: BlockName;
    parent?: DescribeBlock;
    /** @deprecated Please get from `children` array instead */
    tests: Array<TestEntry>;
};
export type TestError = Exception | [Exception | undefined, Exception];
export type TestEntry = {
    type: 'test';
    asyncError: Exception;
    errors: Array<TestError>;
    retryReasons: Array<TestError>;
    fn: TestFn;
    invocations: number;
    mode: TestMode;
    concurrent: boolean;
    name: TestName;
    numPassingAsserts: number;
    parent: DescribeBlock;
    startedAt?: number | null;
    duration?: number | null;
    seenDone: boolean;
    status?: TestStatus | null;
    timeout?: number;
    failing: boolean;
};
export {};
