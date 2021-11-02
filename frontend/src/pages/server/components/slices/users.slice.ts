import { createSlice } from '@reduxjs/toolkit'
import { UserInfo } from 'pages/auth/components/auth.slice'
import { RootState } from 'redux/store'

interface UsersSliceInitialState {
  users: UserInfo[] | null,
  userError: string
}
const initialState: UsersSliceInitialState = {
  users: null,
  userError: ''
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload
    }
  }
})

export const { setUsers } = usersSlice.actions

export const selectUsers = (state: RootState) => state.users.users

export default usersSlice.reducer
