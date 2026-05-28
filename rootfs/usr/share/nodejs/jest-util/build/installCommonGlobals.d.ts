/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/// <reference types="jest__types" />
import type { Config } from '@jest/types';
export default function installCommonGlobals(globalObject: typeof globalThis, globals: Config.ConfigGlobals): typeof globalThis & Config.ConfigGlobals;
