// --------------------------------------------------------------//
// ---------SỬ DỤNG MODULE fs ĐỂ ĐỌC DỮ LIỆU FILE JSON-----------//
// -------------EXPORTS CÁC PHƯƠNG THỨC CỦA CLASS Movies--------//
//--------------------ĐỂ SỬ DỤNG CHO CONTROLLERS----------------//
// -------------------------------------------------------------//

const path = require("path");

const fs = require("fs").promises;

const readDataFile = async () => {
    let pathDetailGenreList = path.join(
        path.dirname(require.main.filename),
        "data",
        "genreList.json"
    );
    let pathDetailMediaTypeList = path.join(
        path.dirname(require.main.filename),
        "data",
        "mediaTypeList.json"
    );
    let pathDetailMovieList = path.join(
        path.dirname(require.main.filename),
        "data",
        "movieList.json"
    );
    let pathDetailUserToken = path.join(
        path.dirname(require.main.filename),
        "data",
        "userToken.json"
    );
    let pathDetailVideoList = path.join(
        path.dirname(require.main.filename),
        "data",
        "videoList.json"
    );
    let data = {};
    try {
        const genreListData = await fs.readFile(pathDetailGenreList, "utf8");
        data.genreListData = await JSON.parse(genreListData);
    } catch (err) {
        data.genreListDataError = "Cannot get data!";
    }
    try {
        const mediaTypeListData = await fs.readFile(
            pathDetailMediaTypeList,
            "utf8"
        );
        data.mediaTypeListData = await JSON.parse(mediaTypeListData);
    } catch (err) {
        data.mediaTypeListDataError = "Cannot get data!";
    }
    try {
        const movieListData = await fs.readFile(pathDetailMovieList, "utf8");
        data.movieListData = await JSON.parse(movieListData);
    } catch (err) {
        data.movieListDataError = "Cannot get data!";
    }
    try {
        const userTokenData = await fs.readFile(pathDetailUserToken, "utf8");
        data.userTokenData = await JSON.parse(userTokenData);
    } catch (err) {
        data.userTokenDataError = "Cannot get data!";
    }
    try {
        const videoListData = await fs.readFile(pathDetailVideoList, "utf8");
        data.videoListData = await JSON.parse(videoListData);
    } catch (err) {
        data.videoListDataError = "Cannot get data!";
    }
    return data;
};

module.exports = class Movies {
    static async fetchAllData(callback) {
        const data = await readDataFile();
        callback(data);
    }
    static async fetchTrendingData(callback) {
        const data = await readDataFile();
        if (data && data.movieListData) {
            const movies = data.movieListData.slice().sort((a, b) => {
                return b.popularity - a.popularity;
            });
            const trendingData = [];
            for (let i = 0; i < movies.length; i += 20) {
                const themeArr = movies.slice(i, i + 20);
                trendingData.push(themeArr);
            }

            callback(trendingData);
        } else {
            callback([]);
        }
    }
    static async fetchGenreList(callback) {
        const data = await readDataFile();
        if (data && data.genreListData) {
            callback(data.genreListData);
        } else {
            callback([]);
        }
    }
    static async fetchTopRateData(callback) {
        const data = await readDataFile();
        if (data && data.movieListData) {
            const movies = data.movieListData.slice().sort((a, b) => {
                return b.vote_average - a.vote_average;
            });
            const topRateData = [];
            for (let i = 0; i < movies.length; i += 20) {
                const themeArr = movies.slice(i, i + 20);
                topRateData.push(themeArr);
            }
            callback(topRateData);
        } else {
            callback([]);
        }
    }
    static async fetchGenreData(genreId, callback) {
        const data = await readDataFile();
        if (data && data.movieListData && data.genreListData) {
            const movies = data.movieListData.slice().filter((movie) => {
                return movie.genre_ids.includes(parseInt(genreId));
            });

            const genreItem = data.genreListData.slice().find((genre) => {
                return genre.id === parseInt(genreId);
            });
            if (genreItem && genreItem.name) {
                const genreName = genreItem.name;
                const genreData = [];
                for (let i = 0; i < movies.length; i += 20) {
                    const theme = movies.slice(i, i + 20);
                    genreData.push(theme);
                }
                callback(genreName, genreData);
            }
        } else {
            callback([]);
        }
    }
    static async fetchVideoData(videoId, callback) {
        const data = await readDataFile();
        if (data && data.videoListData) {
            const filterVideos = data.videoListData.filter((vid) => {
                return vid.id === videoId;
            });

            if (filterVideos && filterVideos.length > 0) {
                const videoCall = filterVideos.map((vid) => {
                    return vid.videos.filter((vidFilter) => {
                        return (
                            (vidFilter.official === true &&
                                vidFilter.site === "YouTube" &&
                                vidFilter.type === "Trailer") ||
                            vidFilter.type === "Teaser"
                        );
                    });
                });
                if (
                    videoCall &&
                    videoCall.length > 0 &&
                    videoCall[0].length > 0
                ) {
                    videoCall[0].sort((a, b) => {
                        return b.published_at - a.published_at;
                    });
                    callback(videoCall[0][0]);
                } else {
                    callback({ message: "Not found video" });
                }
            } else if (filterVideos && !filterVideos.length) {
                callback({ message: "Not found video" });
            }
        } else {
            callback({ message: "Cannot read data" });
        }
    }
    // static async fetchSearchData(keyWords, callback) {
    //     const data = await readDataFile();

    //     if (data && data.movieListData) {
    //         const dataSearch = data.movieListData.map((movie) => {
    //             return {
    //                 ...movie,
    //                 keyData: (movie.title
    //                     ? movie.title
    //                     : movie.name + movie.overview
    //                 ).toLowerCase(),
    //             };
    //         });

    //         const searchResults = dataSearch.filter((data) => {
    //             return data.keyData.indexOf(keyWords) !== -1;
    //         });

    //         if (searchResults.length < 1) {
    //             callback(null);
    //         } else {
    //             const searchResultsForPages = [];
    //             for (let i = 0; i < searchResults.length; i += 20) {
    //                 const temp = searchResults.slice(i, i + 20);
    //                 searchResultsForPages.push(temp);
    //             }
    //             callback(searchResultsForPages);
    //         }
    //     } else {
    //         callback(null);
    //     }
    // }
    static async fetchTokenData(callback) {
        const data = await readDataFile();
        callback(data.userTokenData);
    }
    static async fetchSearchDataFilter(
        keyWords,
        genre,
        mediaType,
        language,
        year,
        callback
    ) {
        const data = await readDataFile();
        if (data && data.movieListData && data.movieListData.length > 0) {
            const dataSearch = data.movieListData.map((movie) => {
                return {
                    ...movie,
                    keyData: (
                        (movie.title ? movie.title : movie.name) +
                        movie.overview
                    )
                        .replace(/ |-/g, "")
                        .toLowerCase(),
                };
            });

            const dataKeyWordsSearch = dataSearch.filter((movie) => {
                return movie.keyData.includes(keyWords);
            });

            if (
                !genre &&
                !mediaType &&
                !language &&
                !year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataForCallback = [];
                for (let i = 0; i < dataKeyWordsSearch.length; i += 20) {
                    dataForCallback.push(dataKeyWordsSearch.slice(i, i + 20));
                }
                callback(dataForCallback);
            } else if (
                genre &&
                !mediaType &&
                !language &&
                !year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return movie.genre_ids.includes(genre);
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                !genre &&
                mediaType &&
                !language &&
                !year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return movie.media_type === mediaType;
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                !genre &&
                !mediaType &&
                language &&
                !year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return movie.original_language === language;
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                !genre &&
                !mediaType &&
                !language &&
                year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        (movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                        ).split("-")[0] === year
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                genre &&
                mediaType &&
                !language &&
                !year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.genre_ids.includes(genre) &&
                        movie.media_type === mediaType
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                !genre &&
                mediaType &&
                language &&
                !year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.original_language === language &&
                        movie.media_type === mediaType
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                !genre &&
                !mediaType &&
                language &&
                year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.original_language === language &&
                        (movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                        ).split("-")[0] === year
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                genre &&
                !mediaType &&
                !language &&
                year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.genre_ids.includes(genre) &&
                        (movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                        ).split("-")[0] === year
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                genre &&
                !mediaType &&
                language &&
                !year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.genre_ids.includes(genre) &&
                        movie.original_language === language
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                !genre &&
                mediaType &&
                !language &&
                year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.media_type === mediaType &&
                        (movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                        ).split("-")[0] === year
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                genre &&
                mediaType &&
                language &&
                !year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.original_language === language &&
                        movie.genre_ids.includes(genre) &&
                        movie.media_type === mediaType
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                !genre &&
                mediaType &&
                language &&
                year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.original_language === language &&
                        (movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                        ).split("-")[0] === year &&
                        movie.media_type === mediaType
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                genre &&
                !mediaType &&
                language &&
                year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.original_language === language &&
                        (movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                        ).split("-")[0] === year &&
                        movie.genre_ids.includes(genre)
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                genre &&
                mediaType &&
                !language &&
                year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.media_type === mediaType &&
                        (movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                        ).split("-")[0] === year &&
                        movie.genre_ids.includes(genre)
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else if (
                genre &&
                mediaType &&
                language &&
                year &&
                dataKeyWordsSearch &&
                dataKeyWordsSearch.length > 0
            ) {
                const dataFilter = dataKeyWordsSearch.filter((movie) => {
                    return (
                        movie.original_language === language &&
                        (movie.release_date
                            ? movie.release_date
                            : movie.first_air_date
                        ).split("-")[0] === year &&
                        movie.genre_ids.includes(genre) &&
                        movie.media_type === mediaType
                    );
                });

                if (dataFilter && dataFilter.length > 0) {
                    const dataForCallback = [];
                    for (let i = 0; i < dataFilter.length; i += 20) {
                        dataForCallback.push(dataFilter.slice(i, i + 20));
                    }

                    callback(dataForCallback);
                } else {
                    callback(null);
                }
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    }
};
