import axios, { AxiosError } from 'axios'
import { ApiRequest, ApiError } from './ApiTypes'

const { CancelToken } = axios
export const serverUrl: string = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:${process.env.REACT_APP_API_PORT || 3000}`

function getString(obj: { [key: string]: string | null | number } | null, key: string): string | null {
  if (obj && key in obj) {
    const x = obj[key]
    if (typeof x === 'string') return x
  }
  return null
}

function transformError(error: AxiosError): ApiError {
  if (!error) return null
  if (!error.response) return { code: `E_CONNECT_FAIL`, httpStatus: 0, message: error.message }
  if (!error.response.data) return { code: error.response.statusText, httpStatus: error.response.status, message: error.message }
  return {
    code: getString(error.response.data, 'code') || error.response.statusText,
    httpStatus: error.response.status,
    message: getString(error.response.data, 'message') || 'Something went quite wrong.',
  }
}

interface ApiCancelFn {
  (): void
}

const tokenKey = 'scAuthToken'

export const getToken = (): string | null => {
  const token = localStorage.getItem(tokenKey)
  if (token && token.length > 1) return token
  return null
}
export const setToken = (token: string | undefined): void => {
  if (token && token !== 'undefined') {
    localStorage.setItem(tokenKey, token)
  }
}
export const unsetToken = (): void => {
  const token = localStorage.getItem(tokenKey)
  if (token) {
    localStorage.removeItem(tokenKey)
  }
}

function server<R, P>(request: ApiRequest<R, P>): ApiCancelFn {
  const source = CancelToken.source()

  const { path, method, timeout, variablesJson, onSuccess, onFail } = request
  const token = getToken()
  const headers = request.headers || {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const params = variablesJson ? JSON.parse(variablesJson) : undefined
  axios({
    url: path,
    method,
    baseURL: serverUrl,
    timeout: timeout || 40000,
    params,
    data: request.data,
    headers: headers || {},
    responseType: 'json',
    cancelToken: source.token,
  })
    .then((response) => {
      onSuccess(response.data as R)
    })
    .catch((error) => {
      if (!axios.isCancel(error)) {
        onFail(transformError(error))
      }
    })

  return () => {
    source.cancel()
  }
}

export default server
