import { Helmet } from "react-helmet";
import SearchForm from "./search-page/SearchForm";
import SearchResult from "./search-page/SearchResult";
import { useEffect, useState } from "react";

import styles from "./SearchPage.module.css";

const SearchPage = () => {
    const [currentKeyWords, setCurrentKeyWords] = useState(null);
    const [genreValue, setGenreValue] = useState(null);
    const [mediaTypeValue, setMediaTypeValue] = useState(null);
    const [languageValue, setLanguageValue] = useState(null);
    const [yearValue, setYearValue] = useState(null);

    const currentKeyWordsHandle = (newCurrentKeyWords) => {
        setCurrentKeyWords(newCurrentKeyWords);
    };

    const currentGenreSearchHandle = (newGenre) => {
        setGenreValue(newGenre);
    };
    const currentMediaTypeSearchHandle = (newMediaType) => {
        setMediaTypeValue(newMediaType);
    };
    const currentLanguageSearchHandle = (newLanguage) => {
        setLanguageValue(newLanguage);
    };
    const currentYearSearchHandle = (newYear) => {
        setYearValue(newYear);
    };

    return (
        <div className={styles["search-page"]}>
            <Helmet>
                <title>Movie Search Page</title>
            </Helmet>
            <SearchForm
                currentKeyWordsHandle={currentKeyWordsHandle}
                currentGenreSearchHandle={currentGenreSearchHandle}
                currentMediaTypeSearchHandle={currentMediaTypeSearchHandle}
                currentLanguageSearchHandle={currentLanguageSearchHandle}
                currentYearSearchHandle={currentYearSearchHandle}
            />
            <SearchResult
                currentKeyWords={currentKeyWords}
                genreValue={genreValue}
                mediaTypeValue={mediaTypeValue}
                languageValue={languageValue}
                yearValue={yearValue}
            />
        </div>
    );
};

export default SearchPage;
