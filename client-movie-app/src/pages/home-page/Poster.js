import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchVideoYoutube } from "../../store/fetchVideoYoutube";
import YouTube from "react-youtube";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import styles from "./Poster.module.css";

const Poster = ({ movieData }) => {
    const [isClick, setIsClick] = useState(false);
    const [lastClickId, setLastClickId] = useState(null);
    const [moviePoster, setMoviePoster] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [videoData, setVideoData] = useState(null);

    const [clickCount, setClickCount] = useState(0);

    const { dataYoutube, statusYoutube, errorYoutube } = useSelector(
        (state) => {
            return state.fetchVideoYoutubeSlice;
        }
    );

    const dispatch = useDispatch();

    const clickHandle = (movie) => {
        if (errorYoutube === "Unauthorized") {
            window.alert("Unauthorized to show video!");
        }
        setClickCount(clickCount + 1);
        if (movie.id === lastClickId) {
            setIsClick(!isClick);
            setLastClickId(movie.id);
        } else {
            setIsClick(true);
            setLastClickId(movie.id);
        }
        setMoviePoster(movie);
        dispatch(fetchVideoYoutube(movie));
    };

    useEffect(() => {
        if (dataYoutube) {
            setVideoData(dataYoutube);
            setErrorMessage(null);
        } else if (!dataYoutube) {
            setVideoData(null);
            setErrorMessage(errorYoutube);
        }
    }, [clickCount, dataYoutube, errorYoutube, videoData, errorMessage]);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 1,
        swipeToSlide: true,
        responsive: [
            {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 8,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
        ],
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
            <div className={styles["slider-global"]}>
                <div className={styles["slider-contain"]}>
                    <Slider {...settings}>
                        {movieData &&
                            movieData.length &&
                            movieData.map((movie) => {
                                return (
                                    <div
                                        key={movie.id}
                                        className={styles.slider}
                                        onClick={() => {
                                            clickHandle(movie);
                                        }}
                                    >
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            alt={
                                                movie.title
                                                    ? movie.title
                                                    : movie.name
                                            }
                                            title={
                                                movie.title
                                                    ? movie.title
                                                    : movie.name
                                            }
                                        />
                                    </div>
                                );
                            })}
                    </Slider>
                </div>
            </div>
            {isClick && (
                <div className={styles.youtube}>
                    <div className={styles["description-youtube"]}>
                        {moviePoster && (
                            <div>
                                <h2>
                                    {moviePoster.title
                                        ? moviePoster.title
                                        : moviePoster.name}
                                </h2>
                                <hr />
                                <h5>
                                    Release Date:{" "}
                                    {moviePoster.release_date
                                        ? moviePoster.release_date
                                        : moviePoster.first_air_date}
                                    <br />
                                    Vote:{" "}
                                    {moviePoster.vote_average &&
                                        moviePoster.vote_average}
                                    /10
                                </h5>
                                <p>{moviePoster.overview}</p>
                            </div>
                        )}
                    </div>

                    <div className={styles["youtube-video"]}>
                        {statusYoutube === "loading" && (
                            <p style={{ textAlign: "center" }}>
                                Loading data...
                            </p>
                        )}
                        {videoData &&
                            videoData.videoData &&
                            videoData.videoData.key && (
                                <YouTube
                                    videoId={videoData.videoData.key}
                                    opts={opts}
                                    style={{ height: "100%" }}
                                />
                            )}
                        {errorMessage && moviePoster && (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${moviePoster.backdrop_path}`}
                                alt={
                                    moviePoster.title
                                        ? moviePoster.title
                                        : moviePoster.name
                                }
                                title={
                                    moviePoster.title
                                        ? moviePoster.title
                                        : moviePoster.name
                                }
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Poster;
