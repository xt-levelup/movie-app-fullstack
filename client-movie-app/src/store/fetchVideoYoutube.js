import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVideoYoutube = createAsyncThunk(
    "fetchVideoYoutube/fetchVideoYoutube",
    async (movie, { rejectWithValue }) => {
        const urlServer = "http://localhost:5000/api/movies/video";
        const user = "User 02";
        const token = "RYoOcWM4JW";

        try {
            const response = await fetch(urlServer, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    User: user,
                },
                body: JSON.stringify({
                    videoId: movie.id,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            } else {
                return data;
            }
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const fetchVideoYoutubeSlice = createSlice({
    name: "fetchVideoYoutube",
    initialState: {
        dataYoutube: null,
        statusYoutube: "idle",
        errorYoutube: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVideoYoutube.fulfilled, (state, action) => {
                state.statusYoutube = "succeeded";
                state.dataYoutube = action.payload;
                state.errorYoutube = null;
            })
            .addCase(fetchVideoYoutube.pending, (state, action) => {
                state.statusYoutube = "loading";
            })
            .addCase(fetchVideoYoutube.rejected, (state, action) => {
                state.statusYoutube = "failed";
                state.errorYoutube = action.payload;
                state.dataYoutube = null;
            });
    },
});

export default fetchVideoYoutubeSlice.reducer;
