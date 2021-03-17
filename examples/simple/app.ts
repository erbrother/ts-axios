import { updateNamedExports } from 'typescript'
import axios from '../../src/index'

axios({
  method: 'get',
  url: '/simple/get',
  params: {
    a: 1,
    b: 2
  }
})

class Animal {
  name: string
  age: number

  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }

  public changeName(name: string) {
    console.log(this)
    this.name = name
  }

  public barking() {
    console.log(this.name)
  }
}


// dog.barking()
function request(config) {
  return new Promise((resolve, reject) => {
    console.log(config)
    setTimeout(() => {
      resolve({
        code: 200,
        msg: 'hello world'
      })
    }, 3000)
  })
}

let chain: any[] = [{
  resolve: request,
  reject: undefined
}]

let config = {
  count: 0
}

function changeConfig(config) {
  console.log(config)
  config.count += 1

  return config
}

function changedRes(res) {
  console.log(res)
  res.msg = 'changed'

  return res
}

function getRes(res) {
  console.log(res)
}

chain.unshift({
  resolve: changeConfig,
  reject: config
})

chain.push({
  resolve: changedRes
})
chain.push({
  resolve: getRes,
  reject: undefined
})



let promise = Promise.resolve(config)

while(chain.length) {
  let {resolve, reject} = chain.shift()

  promise = promise.then(resolve, reject)
}