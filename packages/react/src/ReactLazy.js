/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Wakeable, Thenable} from 'shared/ReactTypes';

import {REACT_LAZY_TYPE} from 'shared/ReactSymbols';

const Uninitialized = -1;
const Pending = 0;
const Resolved = 1;
const Rejected = 2;

type UninitializedPayload<T> = {
  _status: -1,
  _result: () => Thenable<{default: T, ...}>,
};

type PendingPayload = {
  _status: 0,
  _result: Wakeable,
};

type ResolvedPayload<T> = {
  _status: 1,
  _result: T,
};

type RejectedPayload = {
  _status: 2,
  _result: mixed,
};

type Payload<T> =
  | UninitializedPayload<T>
  | PendingPayload
  | ResolvedPayload<T>
  | RejectedPayload;

export type LazyComponent<T, P> = {
  $$typeof: Symbol | number,
  _payload: P,
  _init: (payload: P) => T,
};

function lazyInitializer(payload) {
  if (payload._status === Uninitialized) {
    const ctor = payload._result;
    const thenable = ctor();
    // Transition to the next state.
    const pending = payload
    pending._status = Pending;
    pending._result = thenable;
    thenable.then(
      moduleObject => {
        if (payload._status === Pending) {
          const defaultExport = moduleObject.default;
          // Transition to the next state.
          const resolved = payload
          resolved._status = Resolved;
          resolved._result = defaultExport;
        }
      },
      error => {
        if (payload._status === Pending) {
          // Transition to the next state.
          const rejected = payload
          rejected._status = Rejected;
          rejected._result = error;
        }
      },
    );
  }
  if (payload._status === Resolved) {
    return payload._result;
  } else {
    throw payload._result;
  }
}

export function lazy(
  ctor: () => Thenable<{default: T, ...}>,
) {
  const payload = {
    // We use these fields to store the result.
    _status: -1,
    _result: ctor,
  };

  const lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer,
  };

  return lazyType;
}
