class CancelToken {
  promise: Promise<string>

  constructor(executor: Function) {
    let resolvePromise;

    this.promise = new Promise(resolve => {
      resolvePromise = resolve
    })

    executor(() => {
      resolvePromise('abort')
    })
  }
}

let cancel;
const canceler = new CancelToken(fn => {
  cancel = fn
})

canceler.promise.then(() => {
  console.log('i had canceled')
})

console.log('prepare to cancel')
setTimeout(() => {
  cancel()
}, 1000)