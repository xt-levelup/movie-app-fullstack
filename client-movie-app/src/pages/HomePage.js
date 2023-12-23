import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import Banner from "./home-page/Banner";
import Poster from "./home-page/Poster";
import Content from "./home-page/Content";
import styles from "./HomePage.module.css";

const HomePage = () => {
    const [movieData, setMovieData] = useState([]);

    const receiveData = (movieData) => {
        setMovieData(movieData);
    };

    return (
        <div className={styles.contain}>
            <div>
                <Helmet>
                    <title>Movie Home Page</title>
                </Helmet>
                <Banner transferMovieData={receiveData} />
                <Poster movieData={movieData} />
                <Content />
            </div>
        </div>
    );
};

export default HomePage;
