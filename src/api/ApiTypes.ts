export type ApiError = null | { code: string; httpStatus: number; message: string }

export interface Data<T> {
  error: ApiError
  loading: boolean
  data: T | null
  message?: string | null
  reload?: boolean
}

export interface ApiRequest<ResponseType, PayloadType> {
  readonly method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  readonly path: string
  readonly data?: PayloadType
  readonly variablesJson?: string | null
  readonly timeout?: number
  readonly headers?: { [key: string]: string }
  readonly onSuccess: (data: ResponseType) => void
  readonly onFail: (error: ApiError) => void
}
