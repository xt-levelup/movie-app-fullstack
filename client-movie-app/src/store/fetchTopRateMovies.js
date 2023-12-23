import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTopRateMovies = createAsyncThunk(
    "fetchTopRateMovies/fetchTopRateMovies",
    async (_, { rejectWithValue }) => {
        const urlServer = "http://localhost:5000/api/movies/top-rate";
        try {
            const fetchData = await fetch(urlServer);
            if (!fetchData.ok) {
                throw new Error("Cannot get top rate data!");
            } else {
                const data = await fetchData.json();
                return data;
            }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const fetchTopRateMoviesSlice = createSlice({
    name: "fetchTopRateMovies",
    initialState: {
        topRateData: null,
        topRateStatus: "idle",
        topRateError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTopRateMovies.fulfilled, (state, action) => {
                state.topRateStatus = "succeeded";
                state.topRateData = action.payload;
            })
            .addCase(fetchTopRateMovies.pending, (state, action) => {
                state.topRateStatus = "loading";
            })
            .addCase(fetchTopRateMovies.rejected, (state, action) => {
                state.topRateStatus = "failed";
                state.topRateError = action.payload;
            });
    },
});

export default fetchTopRateMoviesSlice.reducer;
