import { isPlainObject, isString } from "./util";

export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }

  return data
}

export function transformResponse(data: any): any {
  if (isString(data)) {
    try {
      data = JSON.parse(data as string)
    } catch(e) {
      // do nothing
    }
  }

  return data
}