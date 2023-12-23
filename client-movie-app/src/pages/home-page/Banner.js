import styles from "./Banner.module.css";

import { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { fetchBannerMovieData } from "../../store/fetchBannerMovieData";

const Banner = ({ transferMovieData }) => {
    const [movieData, setMovieData] = useState(null);
    const [urlBannerBackdrop, setUrlBannerBackdrop] = useState("");
    const [backgroundBanner, setBackgroundBanner] = useState("");
    const [isBackgroundSet, setIsBackgroundSet] = useState(false);

    const [bannerTitle, setBannerTitle] = useState("");
    const [bannerOverview, setBannerOverview] = useState("");

    const { data, status, error } = useSelector((state) => {
        return state.fetchBannerMovieDataSlice;
    });
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchBannerMovieData());
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setMovieData(data);
            transferMovieData(data);
        }
    }, [data, transferMovieData]);

    useEffect(() => {
        if (!isBackgroundSet && movieData && movieData.length > 0) {
            const indexBackdrop = Math.floor(Math.random() * movieData.length);

            if (movieData[indexBackdrop] && movieData[indexBackdrop].title) {
                setBannerTitle(movieData[indexBackdrop].title);
            } else {
                setBannerTitle(movieData[indexBackdrop].original_name);
            }
            if (movieData[indexBackdrop] && movieData[indexBackdrop].overview) {
                setBannerOverview(movieData[indexBackdrop].overview);
            }
            setUrlBannerBackdrop(movieData[indexBackdrop].backdrop_path);
            setIsBackgroundSet(true);
        }
    }, [movieData, isBackgroundSet]);

    useEffect(() => {
        setBackgroundBanner(
            "https://image.tmdb.org/t/p/w500" + urlBannerBackdrop
        );
    }, [urlBannerBackdrop]);

    return (
        <div>
            {status === "loading" && (
                <p style={{ textAlign: "center", marginTop: "60px" }}>
                    Getting data...
                </p>
            )}
            {status === "failed" && (
                <p style={{ textAlign: "center", marginTop: "60px" }}>
                    {error}
                </p>
            )}
            {status === "succeeded" && (
                <div
                    className={styles.contain}
                    style={{ backgroundImage: `url(${backgroundBanner})` }}
                >
                    <div className={styles.information}>
                        <h1>{bannerTitle}</h1>
                        <div className={styles.button}>
                            <button>Play</button>
                            <button>My list</button>
                        </div>
                        <div className={styles.overview}>
                            <p>{bannerOverview}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banner;
