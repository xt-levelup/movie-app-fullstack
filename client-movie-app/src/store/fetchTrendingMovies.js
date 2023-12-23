import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchTrendingMovies = createAsyncThunk(
    "fetchTrendingMovies/fetchTrendingMovies",
    async (_, { rejectWithValue }) => {
        const urlServer = "http://localhost:5000/api/movies/trending";
        try {
            const fetchData = await fetch(urlServer);
            if (!fetchData.ok) {
                throw new Error("Cannot get data from server!");
            } else {
                const data = await fetchData.json();
                return data;
            }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const fetchTrendingMoviesSlice = createSlice({
    name: "fetchTrendingMoviesSlice",
    initialState: {
        trendingData: null,
        trendingStatus: "idle",
        trendingError: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
                state.trendingStatus = "succeeded";
                state.trendingData = action.payload;
            })
            .addCase(fetchTrendingMovies.pending, (state, action) => {
                state.trendingStatus = "loading";
            })
            .addCase(fetchTrendingMovies.rejected, (state, action) => {
                state.trendingStatus = "failed";
                state.trendingError = action.payload;
            });
    },
});

export default fetchTrendingMoviesSlice.reducer;
