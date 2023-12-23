import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchToSearch = createAsyncThunk(
    "fetchToSearch/fetchToSearch",

    async (
        { page, searchValue, genre, mediaType, language, year },
        { rejectWithValue }
    ) => {
        const urlServer = "http://localhost:5000/api/movies/search";
        const user = "User 02";
        const token = "RYoOcWM4JW";
        try {
            const fetchData = await fetch(urlServer, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    User: user,
                },
                body: JSON.stringify({
                    keyWords: searchValue,
                    page: page,
                    genre: genre,
                    mediaType: mediaType,
                    language: language,
                    year: year,
                }),
            });

            const data = await fetchData.json();
            console.log("data:", data);

            if (!fetchData.ok) {
                throw new Error(data.message);
            } else {
                console.log("data search:", data);
                return data;
            }
        } catch (err) {
            return rejectWithValue(err.message || "Cannot connect to server");
        }
    }
);

const fetchToSearchSlice = createSlice({
    name: "fetchToSearchSlice",
    initialState: {
        dataSearch: null,
        statusSearch: "idle",
        errorSearch: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchToSearch.fulfilled, (state, action) => {
                state.statusSearch = "succeeded";
                state.dataSearch = action.payload;
                state.errorSearch = null;
            })
            .addCase(fetchToSearch.pending, (state, action) => {
                state.statusSearch = "loading";
            })
            .addCase(fetchToSearch.rejected, (state, action) => {
                state.errorSearch = action.payload;
                state.dataSearch = null;
                state.statusSearch = "failed";
            });
    },
});

export default fetchToSearchSlice.reducer;
