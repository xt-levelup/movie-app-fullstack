const Movies = require("../models/movies");

exports.genreList = (req, res, next) => {
    Movies.fetchGenreList((genreList) => {
        res.status(200).json(genreList);
    });
};

exports.bannerMovies = (req, res, next) => {
    Movies.fetchAllData((moviesData) => {
        const newMovieArray = moviesData.movieListData.map((movie) => {
            return {
                id: movie.id,
                releaseDate: movie.release_date
                    ? new Date(movie.release_date)
                    : new Date(movie.first_air_date),
            };
        });
        const newestIdMovies = newMovieArray.sort((a, b) => {
            return b.releaseDate - a.releaseDate;
        });
        const top20IdNewestMovies = newestIdMovies.slice(0, 20);

        const bannerMovies = moviesData.movieListData.filter((movie) => {
            return top20IdNewestMovies.some((mod) => {
                return mod.id === movie.id;
            });
        });

        res.json(bannerMovies);
    });
};

exports.getTrending = (req, res, next) => {
    Movies.fetchTrendingData((movies) => {
        if (movies.length > 0) {
            res.status(200).json({
                results: movies[0],
                page: 1,
                total_pages: movies.length,
            });
        }
    });
};

exports.postTrending = (req, res, next) => {
    const page = req.body.currentPage;

    Movies.fetchTrendingData((movies) => {
        res.status(200).json({
            results: movies[parseInt(page) - 1],
            page: parseInt(page),
            total_pages: movies.length,
        });
    });
};

exports.getTopRate = (req, res, next) => {
    Movies.fetchTopRateData((movies) => {
        if (movies.length > 0) {
            res.status(200).json({
                results: movies[0],
                page: 1,
                total_pages: movies.length,
            });
        }
    });
};

exports.postTopRate = (req, res, next) => {
    const page = req.body.currentPage;
    Movies.fetchTopRateData((movies) => {
        res.status(200).json({
            results: movies[parseInt(page - 1)],
            page: parseInt(page),
            total_pages: movies.length,
        });
    });
};

exports.getGenreType = (req, res, next) => {
    const genre = req.params.genreType;

    Movies.fetchGenreList((genreList) => {
        if (genre === "no-params") {
            return res.status(400).json({ message: "Not found genre params" });
        } else if (
            !genreList.some((item) => {
                return item.id === parseInt(genre);
            })
        ) {
            return res.status(400).json({
                message: "Not found that genre id",
            });
        } else {
            Movies.fetchGenreData(genre, (genreName, movies) => {
                return res.status(200).json({
                    results: movies[0],
                    page: 1,
                    total_pages: movies.length,
                    genre_name: genreName,
                });
            });
        }
    });
};

exports.postGenreType = (req, res, next) => {
    const genre = req.params.genreType;
    const page = req.body.currentPage;

    Movies.fetchGenreData(genre, (genreName, movies) => {
        res.status(200).json({
            results:
                parseInt(page) < movies.length + 1
                    ? movies[parseInt(page) - 1]
                    : movies[movies.length - 1],
            page:
                parseInt(page) < movies.length + 1
                    ? parseInt(page)
                    : movies.length,
            total_pages: movies.length,
            genre_name: genreName,
        });
    });
};

exports.postToGetVideo = (req, res, next) => {
    const videoId = req.body.videoId;
    if (!videoId) {
        return res.status(400).json({
            message: "Not found film_id param",
        });
    } else {
        Movies.fetchVideoData(videoId, (videoData) => {
            if (videoData.message) {
                return res.status(404).json({
                    message: videoData.message,
                });
            } else {
                return res.status(200).json({
                    videoData: videoData,
                });
            }
        });
    }
};

exports.postMovieSearch = (req, res, next) => {
    const keyWords = req.body.keyWords;
    const page = req.body.page;
    const genre = req.body.genre;
    const mediaType = req.body.mediaType;
    const language = req.body.language;
    const year = req.body.year;

    Movies.fetchSearchDataFilter(
        keyWords,
        genre,
        mediaType,
        language,
        year,
        (movies) => {
            if (
                movies &&
                movies.length > 0 &&
                parseInt(page) > 0 &&
                parseInt(page) < movies.length + 1
            ) {
                res.status(200).json({
                    dataSearch: movies[parseInt(page) - 1],
                    page: parseInt(page),
                    total_pages: movies.length,
                });
            } else if (!page) {
                res.status(400).json({
                    message: "Not found keyword param",
                });
            } else {
                res.status(404).json({
                    message: "No found video!",
                });
            }
        }
    );
};
