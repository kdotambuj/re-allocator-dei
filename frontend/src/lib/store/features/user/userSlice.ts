import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  departmentId: number | null
  isAuthenticated: boolean;

}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  role: null,
  isAuthenticated: false,
  departmentId:0
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.departmentId = action.payload.departmentId
     
    },
    clearUser: (state) => {
      state.id = null;
      state.name = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
      state.departmentId = 0
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;