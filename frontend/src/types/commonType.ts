import { RootState } from 'redux/store'

export type Undefinable<T> = T | undefined

export type ThunkState = { state: RootState }

export type WithPayload<T> = {
    payload: T
}

export interface IdAsKeyObject<T = any> {
    [channelId: string]: T
}
