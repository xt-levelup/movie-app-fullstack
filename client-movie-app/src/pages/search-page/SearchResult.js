import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SearchResult.module.css";
import { fetchToSearch } from "../../store/fetchToSearch";
import { fetchVideoYoutube } from "../../store/fetchVideoYoutube";

import Youtube from "react-youtube";

const SearchResult = ({
    currentKeyWords,
    genreValue,
    mediaTypeValue,
    languageValue,
    yearValue,
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [movieData, setMovieData] = useState(null);
    const [isOpenVideo, setIsOpenVideo] = useState(false);

    const { dataSearch, statusSearch, errorSearch } = useSelector((state) => {
        return state.fetchToSearchSlice;
    });
    const { dataYoutube, errorYoutube } = useSelector((state) => {
        return state.fetchVideoYoutubeSlice;
    });

    const dispatch = useDispatch();

    useEffect(() => {
        if (dataSearch && dataSearch.page) {
            setCurrentPage(dataSearch.page);
        } else {
            setCurrentPage(0);
        }
    }, [dataSearch]);

    const pageInputHandle = (event) => {
        if (
            dataSearch &&
            dataSearch.total_pages &&
            parseInt(event.target.value) < dataSearch.total_pages + 1 &&
            parseInt(event.target.value) > 0
        ) {
            setCurrentPage(event.target.value);
        }
    };

    const inputSubmit = (event) => {
        if (event.key === "Enter") {
            if (
                dataSearch &&
                dataSearch.total_pages &&
                parseInt(event.target.value) > dataSearch.total_pages
            ) {
                setCurrentPage(dataSearch.total_pages);
            } else if (
                dataSearch &&
                dataSearch.page &&
                parseInt(event.target.value) < 1
            ) {
                setCurrentPage(1);
            }
            dispatch(
                fetchToSearch({
                    page: parseInt(currentPage),
                    searchValue: currentKeyWords,
                    genre: genreValue,
                    mediaType: mediaTypeValue,
                    language: languageValue,
                    year: yearValue,
                })
            );
        }
    };

    const nextHandle = (event) => {
        event.preventDefault();
        if (
            dataSearch &&
            dataSearch.total_pages &&
            parseInt(currentPage) < dataSearch.total_pages &&
            parseInt(currentPage) > 0
        ) {
            const newCurrentPage = parseInt(currentPage) + 1;
            setCurrentPage(newCurrentPage);
            dispatch(
                fetchToSearch({
                    page: newCurrentPage,
                    searchValue: currentKeyWords,
                    genre: genreValue,
                    mediaType: mediaTypeValue,
                    language: languageValue,
                    year: yearValue,
                })
            );
        }
    };

    const prevHandle = (event) => {
        event.preventDefault();
        if (
            dataSearch &&
            dataSearch.total_pages &&
            parseInt(currentPage) < dataSearch.total_pages + 1 &&
            parseInt(currentPage) > 1
        ) {
            const newCurrentPage = parseInt(currentPage) - 1;
            setCurrentPage(newCurrentPage);
            dispatch(
                fetchToSearch({
                    page: newCurrentPage,
                    searchValue: currentKeyWords,
                    genre: genreValue,
                    mediaType: mediaTypeValue,
                    language: languageValue,
                    year: yearValue,
                })
            );
        }
    };

    const clickMovieHandle = (movie) => {
        setMovieData(movie);
        dispatch(fetchVideoYoutube(movie));
        setIsOpenVideo(true);
        if (errorYoutube === "Unauthorized") {
            window.alert("Unauthorized to show video!");
        }
    };

    const clickCloseHandle = () => {
        setIsOpenVideo(false);
    };
    const closeModalHandle = (event) => {
        if (event.key === "Escape") {
            setIsOpenVideo(false);
        }
    };

    const opts = {
        height: "100%",
        width: "100%",
        playerVars: {
            autoplay: 0,
        },
    };

    return (
        <div>
            <h2>Search Results</h2>
            {statusSearch === "loading" && (
                <p style={{ textAlign: "center" }}>Loading data...</p>
            )}
            <div className={styles["search-videos"]}>
                <div className={styles["search-images-contain"]}>
                    {dataSearch &&
                        dataSearch.dataSearch &&
                        dataSearch.dataSearch.map((movie) => {
                            return (
                                <div
                                    key={movie.id}
                                    className={styles["search-images"]}
                                >
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        title={movie.overview}
                                        onClick={() => {
                                            clickMovieHandle(movie);
                                        }}
                                    />
                                </div>
                            );
                        })}
                </div>
            </div>
            {errorSearch && (
                <p style={{ textAlign: "center" }}>{errorSearch}</p>
            )}
            {isOpenVideo && (
                <div
                    className={styles["show-video"]}
                    tabIndex="0"
                    onKeyDown={closeModalHandle}
                >
                    <button onClick={clickCloseHandle}>X close</button>
                    <div className={styles["video-details"]}>
                        <div className={styles.details}>
                            <h2>
                                {movieData && movieData.title
                                    ? movieData.title
                                    : movieData.name}
                            </h2>
                            <hr />
                            <h5>
                                Realease Day:{" "}
                                {movieData && movieData.release_date
                                    ? movieData.release_date
                                    : movieData.first_air_date}
                                <br />
                                Vote: {movieData && movieData.vote_average}/10
                            </h5>
                            <p style={{ textAlign: "justify" }}>
                                {movieData && movieData.overview}
                            </p>
                        </div>
                        <div className={styles.video}>
                            {dataYoutube && dataYoutube.videoData && (
                                <Youtube
                                    videoId={dataYoutube.videoData.key}
                                    opts={opts}
                                    style={{ height: "100%" }}
                                />
                            )}
                            {errorYoutube && movieData && (
                                <img
                                    src={`https://image.tmdb.org/t/p/w500${movieData.backdrop_path}`}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div>
                <div className={styles.pages}>
                    <button onClick={prevHandle}>Prev</button>
                    <div className={styles["pages-number"]}>
                        <input
                            type="number"
                            value={currentPage}
                            onChange={pageInputHandle}
                            onKeyDown={inputSubmit}
                        />
                        <span>/</span>
                        <span>
                            {dataSearch && dataSearch.total_pages
                                ? dataSearch.total_pages
                                : 0}
                        </span>
                    </div>
                    <button onClick={nextHandle}>Next</button>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
