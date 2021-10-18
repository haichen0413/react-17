/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import type {Fiber} from './ReactInternalTypes';

import ReactSharedInternals from 'shared/ReactSharedInternals';
import {getStackByFiberInDevAndProd} from './ReactFiberComponentStack';
import getComponentName from 'shared/getComponentName';

const ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;

export let current: Fiber | null = null;
export let isRendering: boolean = false;

export function getCurrentFiberOwnerNameInDevOrNull(): string | null {

  return null;
}

function getCurrentFiberStackInDev(): string {
  
  return '';
}

export function resetCurrentFiber() {
  if (__DEV__) {
    ReactDebugCurrentFrame.getCurrentStack = null;
    current = null;
    isRendering = false;
  }
}

export function setCurrentFiber(fiber: Fiber) {
  if (__DEV__) {
    ReactDebugCurrentFrame.getCurrentStack = getCurrentFiberStackInDev;
    current = fiber;
    isRendering = false;
  }
}

export function setIsRendering(rendering: boolean) {
  if (__DEV__) {
    isRendering = rendering;
  }
}

export function getIsRendering() {
  if (__DEV__) {
    return isRendering;
  }
}
