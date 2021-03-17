import axios, { Canceler } from "../../src/index";
const CancelerToken = axios.CancelToken

let cancel: Canceler;

axios.get('/cancel/get', {
  cancelToken: new CancelerToken(c => {
    cancel = c
  })
}).catch(e => {
  if (axios.isCancel(e)) {
    console.log('Request canceled')
  }
})

setTimeout(() => {
  cancel()
}, 200)