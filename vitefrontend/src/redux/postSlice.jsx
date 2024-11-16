import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    posts: [],
    hasmore: true,
    pageSize: 2,
    page: 1
}
const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        setPage: (state, action) => {
            state.page = action.payload;
        },
        setHasmore: (state, action) => {
            state.hasmore = action.payload;
        },
        reset: () => initialState,
    }
});

export const { setPosts, setPage, setHasmore, reset, toggleLike } = postSlice.actions;
export default postSlice.reducer;