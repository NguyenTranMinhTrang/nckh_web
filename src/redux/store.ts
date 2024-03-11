import { configureStore } from '@reduxjs/toolkit';
import userSlice from './reducers/userSlice';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

const store = configureStore({
    reducer: {
        user: userSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;