/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import { Static } from '@sinclair/typebox';
declare const RawSnapshotFormat: import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    callToJSON: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    compareKeys: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TNull>;
    escapeRegex: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    escapeString: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    highlight: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    indent: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TNumber>;
    maxDepth: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TNumber>;
    maxWidth: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TNumber>;
    min: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    printBasicPrototype: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    printFunctionName: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    theme: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
        comment: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
        content: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
        prop: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
        tag: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
        value: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
    }>>>;
}>>;
export declare const SnapshotFormat: import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
    callToJSON: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    compareKeys: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TNull>;
    escapeRegex: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    escapeString: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    highlight: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    indent: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TNumber>;
    maxDepth: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TNumber>;
    maxWidth: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TNumber>;
    min: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    printBasicPrototype: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    printFunctionName: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TBoolean>;
    theme: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TPartial<import("@sinclair/typebox").TObject<{
        comment: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
        content: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
        prop: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
        tag: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
        value: import("@sinclair/typebox").TReadonly<import("@sinclair/typebox").TString<string>>;
    }>>>;
}>>;
export type SnapshotFormat = Static<typeof RawSnapshotFormat>;
export {};
