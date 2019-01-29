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