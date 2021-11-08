import { RootState } from 'redux/store'

export type Undefinable<T> = T | undefined

export type ThunkState = { state: RootState }
