import { relative } from "path"
import { isDate, isPlainObject } from "./util"

interface URLOrigin {
  protocol: string,
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

const urlParsingNode = document.createElement('a')
const currentOrigin = resolveURL(window.location.href)

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url)
  const {protocol, host} = urlParsingNode

  return {
    protocol,
    host
  }
}

export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL)
  return (
    parsedOrigin.protocol === currentOrigin.protocol &&  parsedOrigin.host === currentOrigin.host
    )
}


export function buildURL(url: string, params?: any) {
  if (!params) {
    return url
  }

  const parts: string[] = []

  // 处理pramas
  Object.keys(params).forEach(key => {
    let val = params[key]

    if (val === null || typeof val === 'undefined') {
      return
    }

    let values: string[];

    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }

      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  if (serializedParams) {
    const markIndex = url.indexOf('#')

    if(markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }

  return url
}
/**
 * 正则表达式
 * @param url
 * [a-z\d\+\-\.] 匹配字母数字 + - .  
 */
export function isAbsoluteURL(url: string):boolean {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export function combineURL(baseURL: string, relativeURL?: String): string {
  return relativeURL ? baseURL.replace(/\+$/, '') + '/' + relativeURL.replace(/^\/+/, ''): baseURL
}