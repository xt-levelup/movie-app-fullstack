import { configureStore } from "@reduxjs/toolkit";

import fetchBannerMovieDataSlice from "./fetchBannerMovieData";
import fetchTrendingMoviesSlice from "./fetchTrendingMovies";
import fetchGenreListSlice from "./fetchGenreList";
import fetchTopRateMoviesSlice from "./fetchTopRateMovies";
import fetchVideoYoutubeSlice from "./fetchVideoYoutube";
import fetchToSearchSlice from "./fetchToSearch";

const store = configureStore({
    reducer: {
        fetchBannerMovieDataSlice: fetchBannerMovieDataSlice,
        fetchTrendingMoviesSlice: fetchTrendingMoviesSlice,
        fetchGenreListSlice: fetchGenreListSlice,
        fetchTopRateMoviesSlice: fetchTopRateMoviesSlice,
        fetchVideoYoutubeSlice: fetchVideoYoutubeSlice,
        fetchToSearchSlice: fetchToSearchSlice,
    },
});

export default store;
