/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 */

export interface PromiseSubscription {
  unsubscribe(): void;
}

export function makeCancelable<T>(promise: Promise<T>): { subscription: PromiseSubscription, promise: Promise<T> } {
  let hasCanceled_ = false;

  const wrappedPromise = new Promise<T>((resolve, reject) => {
    promise.then(
      val => !hasCanceled_ ? resolve(val) : {},
      error => !hasCanceled_ ? reject(error) : {}
    );
  });

  return {
    promise: wrappedPromise,
    subscription: {
      unsubscribe() {
        hasCanceled_ = true;
      }
    }
  };
}