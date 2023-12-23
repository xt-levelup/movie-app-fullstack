import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchGenreList = createAsyncThunk(
    "fetchGenreList/fetchGenreList",
    async (_, rejectWithValue) => {
        const urlServer = "http://localhost:5000/genre-list";
        try {
            const fetchData = await fetch(urlServer);
            if (!fetchData.ok) {
                throw new Error("Cannot get genre list!");
            } else {
                const data = await fetchData.json();
                return data;
            }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const fetchGenreListSlice = createSlice({
    name: "fetchGenreListSlice",
    initialState: {
        genreListData: [],
        genreListStatus: "idle",
        genreListError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGenreList.fulfilled, (state, action) => {
                state.genreListStatus = "succeeded";
                state.genreListData = action.payload;
            })
            .addCase(fetchGenreList.pending, (state, action) => {
                state.genreListStatus = "loading";
            })
            .addCase(fetchGenreList.rejected, (state, action) => {
                state.genreListStatus = "failed";
                state.genreListError = action.payload;
            });
    },
});

export default fetchGenreListSlice.reducer;
