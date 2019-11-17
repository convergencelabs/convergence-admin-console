/*
 * Copyright (c) 2019 - Convergence Labs, Inc.
 *
 * This file is part of the Convergence Server, which is released under
 * the terms of the GNU General Public License version 3 (GPLv3). A copy
 * of the GPLv3 should have been provided along with this file, typically
 * located in the "LICENSE" file, which is part of this source code package.
 * Alternatively, see <https://www.gnu.org/licenses/gpl-3.0.html> for the
 * full text of the GPLv3 license, if it was not provided.
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