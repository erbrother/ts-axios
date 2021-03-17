import { AxiosRequestConfig, AxiosResponse } from "../types";
import xhr from "./xhr";
import { buildURL, combineURL, isAbsoluteURL } from "../helpers/url";
import { transformRequest, transformResponse } from "../helpers/data";
import { flattenHeaders, processHeaders } from "../helpers/headers";

function dispatchRequest(config: AxiosRequestConfig) {

  throwIfCancelRequested(config)

  processConfig(config)

  return xhr(config).then(
    res => {
      return transformResponseData(res)
    },
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }

      return Promise.reject(e)
    }
  )
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  config.headers = transformHeaders(config)
  config.data = transformRequestData(config)
  config.headers = flattenHeaders(config.headers, config.method!)
}

function transformUrl(config: AxiosRequestConfig): string {
  let { url, params, baseURL } = config

  if (baseURL && !isAbsoluteURL(url!)) {
    url = combineURL(baseURL, url)
  }

  return buildURL(url!, params)
}

function transformRequestData(config: AxiosRequestConfig): any {
  return transformRequest(config.data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config

  return processHeaders(headers, data)
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transformResponse(res.data)
  return res
}
function throwIfCancelRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
export default dispatchRequest;