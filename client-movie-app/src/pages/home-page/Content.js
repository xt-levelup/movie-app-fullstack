import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
import YouTube from "react-youtube";
import styles from "./Content.module.css";
import { useSelector, useDispatch } from "react-redux";

import { fetchTrendingMovies } from "../../store/fetchTrendingMovies";
import { fetchGenreList } from "../../store/fetchGenreList";
import { fetchTopRateMovies } from "../../store/fetchTopRateMovies";
import { fetchVideoYoutube } from "../../store/fetchVideoYoutube";

const Content = () => {
    const [isTrending, setIsTrending] = useState(false);
    const [isRating, setIsRating] = useState(false);
    const [isGenre, setIsGenre] = useState(false);
    const [isOpenList, setIsOpenList] = useState(false);
    const [isGenreList, setIsGenreList] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [isClickMovie, setIsClickMovie] = useState(false);
    const [lastClickId, setLastClickId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [movieGenre, setMovieGenre] = useState(null);
    const [videoData, setVideoData] = useState(null);

    const { trendingData, trendingError } = useSelector((state) => {
        return state.fetchTrendingMoviesSlice;
    });
    const { genreListData } = useSelector((state) => {
        return state.fetchGenreListSlice;
    });
    const { topRateData, topRateError } = useSelector((state) => {
        return state.fetchTopRateMoviesSlice;
    });

    const { dataYoutube, errorYoutube } = useSelector((state) => {
        return state.fetchVideoYoutubeSlice;
    });

    const [movies, setMovies] = useState(null);
    const [titleMovieType, setTitleMovieType] = useState();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if (trendingError || topRateError) {
            setErrorMessage("Cannot get data from server!");
        } else {
            setErrorMessage(null);
        }
    }, [trendingError, topRateError]);

    useEffect(() => {
        dispatch(fetchGenreList());
        dispatch(fetchTrendingMovies());
        dispatch(fetchTopRateMovies());

        // setIsTrending(true);
    }, [dispatch]);

    useEffect(() => {
        if (params.movieType === "trending" && trendingData) {
            setMovies(trendingData);
            setPageNumber(trendingData.page);
            setTitleMovieType("Trending");
            setIsTrending(true);
        } else if (params.movieType === "top-rate" && topRateData) {
            setMovies(topRateData);
            setPageNumber(topRateData.page);
            setTitleMovieType("Rating");
            setIsRating(true);
        }
    }, [
        trendingData,
        isTrending,
        topRateData,
        isRating,

        isGenre,
        params.movieType,
    ]);

    const downIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );

    const isTrendingHandle = () => {
        setTitleMovieType("Trending");
        setIsTrending(true);
        setIsRating(false);
        setIsGenre(false);
        setErrorMessage(null);
        navigate("/type/trending");
    };
    const isRatingHandle = () => {
        setTitleMovieType("Rating");
        setIsRating(true);
        setIsTrending(false);
        setIsGenre(false);
        setErrorMessage(null);
        navigate("/type/top-rate");
    };
    const genreMouseOverHandle = () => {
        setIsOpenList(true);
        setIsGenreList(true);
    };
    const genreMouseLeaveHandle = () => {
        setIsOpenList(false);
    };
    const genreClickHandle = () => {
        setIsGenreList(!isGenreList);
    };
    const isGenreListOverHandle = () => {
        setIsGenreList(true);
    };
    const isGenreListLeaveHandle = () => {
        setIsGenreList(false);
    };
    const clickGenreListHandle = (idGenre) => {
        setIsGenre(true);
        setIsRating(false);
        setIsTrending(false);
        setIsGenreList(false);
        setTitleMovieType();

        navigate(`/type/${idGenre}`);
    };

    const inputOnChange = (event) => {
        setPageNumber(event.target.value);
    };

    const postHandling = async (currentPage) => {
        const trending = "trending-post";
        const rating = "rating-post";
        const genreId = params.movieType;
        const urlServer = `http://localhost:5000/api/movies/${
            isTrending ? trending : isRating ? rating : genreId
        }`;
        try {
            const fetchData = await fetch(urlServer, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPage: currentPage,
                }),
            });
            if (!fetchData.ok) {
                throw new Error("Cannot post data!");
            } else {
                const data = await fetchData.json();

                setMovies(data);
            }
        } catch (err) {
            setErrorMessage(err.message);
        }
    };

    const inputSubmit = (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (movies && parseInt(pageNumber) > movies.total_pages) {
                setPageNumber(movies.total_pages);

                postHandling(movies.total_pages);
            } else {
                setPageNumber(event.target.value);

                postHandling(event.target.value);
            }
        }
    };
    const nextHandle = (event) => {
        event.preventDefault();
        if (movies && parseInt(pageNumber) < movies.total_pages) {
            setPageNumber(parseInt(pageNumber) + 1);

            postHandling(parseInt(pageNumber) + 1);
        } else {
            setPageNumber(movies.total_pages);
            postHandling(movies.total_pages);
        }
    };
    const prevHandle = (event) => {
        event.preventDefault();
        if (movies && parseInt(pageNumber) > 1) {
            setPageNumber(parseInt(pageNumber) - 1);

            postHandling(parseInt(pageNumber) - 1);
        }
        if (movies && parseInt(pageNumber) > movies.total_pages) {
            setPageNumber(movies.total_pages);
            postHandling(movies.total_pages);
        }
    };

    useEffect(() => {
        if (
            params.movieType !== "trending" &&
            params.movieType !== "top-rate"
        ) {
            const fetchData = async () => {
                try {
                    const urlServer = `http://localhost:5000/api/movies/${params.movieType}`;
                    const response = await fetch(urlServer);
                    if (!response.ok) {
                        const errorResponse = await response.json();
                        throw new Error(errorResponse.message);
                    } else {
                        const data = await response.json();

                        setIsGenre(true);
                        setIsRating(false);
                        setIsTrending(false);
                        setMovies(data);
                        setPageNumber(data.page);
                        setTitleMovieType(data.genre_name);
                        setErrorMessage(null);
                    }
                } catch (err) {
                    setErrorMessage(err.message);
                }
            };
            fetchData();
        }
    }, [params.movieType, isTrending]);

    const isClickMovieHandle = (movie) => {
        if (errorYoutube === "Unauthorized") {
            window.alert("Unauthorized to show video!");
        }
        setMovieGenre(movie);
        dispatch(fetchVideoYoutube(movie));
        if (movie.id === lastClickId) {
            setIsClickMovie(!isClickMovie);
            setLastClickId(movie.id);
        } else {
            setIsClickMovie(true);
            setLastClickId(movie.id);
        }
    };

    useEffect(() => {
        setVideoData(dataYoutube);
    }, [dataYoutube]);

    const opts = {
        height: "100%",
        width: "100%",
        playerVars: {
            autoPlay: 0,
        },
    };

    const closeClickHandle = (event) => {
        event.preventDefault();

        setIsClickMovie(false);
    };
    const closeEscapeHandle = (event) => {
        if (event.key === "Escape") {
            setIsClickMovie(false);
        }
    };

    return (
        <div className={styles.contain}>
            <div className={styles["div-navbar"]}>
                <nav className={styles.navbar}>
                    <span
                        onClick={isTrendingHandle}
                        className={isTrending ? styles.active : undefined}
                    >
                        Trending
                    </span>
                    <span
                        onClick={isRatingHandle}
                        className={isRating ? styles.active : undefined}
                    >
                        Rating
                    </span>
                    <span
                        onMouseOver={genreMouseOverHandle}
                        onMouseLeave={genreMouseLeaveHandle}
                        onClick={genreClickHandle}
                        className={isGenre ? styles.active : undefined}
                    >
                        <div className={styles["div-span"]}>
                            Genre {downIcon}
                        </div>
                    </span>
                </nav>
                {isGenreList && (
                    <div
                        className={styles.genre}
                        onMouseOver={isGenreListOverHandle}
                        onMouseLeave={isGenreListLeaveHandle}
                    >
                        {genreListData &&
                            genreListData.length > 0 &&
                            genreListData.map((genre) => {
                                return (
                                    <p
                                        key={genre.id}
                                        onClick={() => {
                                            clickGenreListHandle(genre.id);
                                        }}
                                    >
                                        {genre.name}
                                    </p>
                                );
                            })}
                    </div>
                )}
            </div>
            {errorMessage && (
                <div>
                    <p style={{ textAlign: "center" }}>{errorMessage}</p>
                </div>
            )}
            {!errorMessage && (
                <div className={styles.content}>
                    <div>
                        <h2>{titleMovieType}</h2>

                        <div className={styles.listMovie}>
                            {movies &&
                                movies.results &&
                                movies.results.length > 0 &&
                                movies.results.map((movie) => {
                                    return (
                                        <div
                                            key={movie.id}
                                            className={styles.listImage}
                                            onClick={() => {
                                                isClickMovieHandle(movie);
                                            }}
                                        >
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
                                                alt={
                                                    movie.title
                                                        ? movie.title
                                                        : movie.name
                                                        ? movie.name
                                                        : movie.original_title
                                                        ? movie.original_title
                                                        : movie.original_name
                                                }
                                                title={
                                                    movie.title
                                                        ? movie.title
                                                        : movie.name
                                                        ? movie.name
                                                        : movie.original_title
                                                        ? movie.original_title
                                                        : movie.original_name
                                                }
                                            />
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            )}
            {isClickMovie && (
                <div
                    className={styles["youtube-contain"]}
                    onKeyDown={closeEscapeHandle}
                    tabIndex="0"
                >
                    <button onClick={closeClickHandle}>X</button>
                    <div className={styles.youtube}>
                        <div className={styles["youtube-description"]}>
                            <h2>
                                {movieGenre.title
                                    ? movieGenre.title
                                    : movieGenre.name}
                            </h2>
                            <hr />
                            <h5>
                                Release day:{" "}
                                {movieGenre.release_date
                                    ? movieGenre.release_date
                                    : movieGenre.first_air_date}
                                <br />
                                Vote: {movieGenre.vote_average}/10
                            </h5>
                            <p>{movieGenre.overview}</p>
                        </div>
                        {videoData && videoData.videoData && (
                            <div className={styles["youtube-video"]}>
                                <YouTube
                                    videoId={videoData.videoData.key}
                                    opts={opts}
                                    style={{ height: "100%" }}
                                />
                            </div>
                        )}
                        {!videoData && movieGenre && (
                            <div className={styles["youtube-image"]}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movieGenre.backdrop_path}`}
                                    alt={
                                        movieGenre.title
                                            ? movieGenre.title
                                            : movieGenre.name
                                    }
                                    title={
                                        movieGenre.title
                                            ? movieGenre.title
                                            : movieGenre.name
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
            <div>
                <div className={styles.page}>
                    <button onClick={prevHandle}>Prev</button>
                    <div className={styles["page-number"]}>
                        <input
                            type="number"
                            onChange={inputOnChange}
                            onKeyDown={inputSubmit}
                            value={pageNumber}
                        />
                        <span>/</span>
                        <span>{movies && movies.total_pages}</span>
                    </div>
                    <button onClick={nextHandle}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default Content;
