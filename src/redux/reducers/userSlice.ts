import { createSlice } from "@reduxjs/toolkit";
import { IUserData } from "../../interface/AppInterface";

interface IState {
    auth: IUserData | null;
}

const initialState: IState = {
    auth: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.auth = action.payload;
        }
    }
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;


