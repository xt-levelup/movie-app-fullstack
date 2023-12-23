import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchBannerMovieData = createAsyncThunk(
    "fetchBannerMovieData/fetchBannerMovieData",
    async (_, { rejectWithValue }) => {
        const urlServer = "http://localhost:5000/banner-movies";
        const user = "User 02";
        const token = "RYoOcWM4JW";
        try {
            const fetchData = await fetch(urlServer, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    User: user,
                },
            });
            if (!fetchData.ok) {
                throw new Error("Cannot fetch data!");
            } else {
                const data = await fetchData.json();
                return data;
            }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const fetchBannerMovieDataSlice = createSlice({
    name: "fetchBannerMovieDataSlice",
    initialState: {
        data: [],
        status: "idle",
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBannerMovieData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchBannerMovieData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchBannerMovieData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default fetchBannerMovieDataSlice.reducer;
