import styles from "./SearchForm.module.css";
import { useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchToSearch } from "../../store/fetchToSearch";
import { fetchGenreList } from "../../store/fetchGenreList";

const SearchForm = ({
    currentKeyWordsHandle,
    currentGenreSearchHandle,
    currentMediaTypeSearchHandle,
    currentLanguageSearchHandle,
    currentYearSearchHandle,
}) => {
    const dispatch = useDispatch();

    const inputValue = useRef();
    const genreValue = useRef();
    const mediaTypeValue = useRef();
    const languageValue = useRef();
    const yearValue = useRef();
    const { genreListData } = useSelector((state) => {
        return state.fetchGenreListSlice;
    });

    useEffect(() => {
        dispatch(fetchGenreList());
    }, [dispatch]);

    const searchIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );

    const submitHandle = (event) => {
        event.preventDefault();
        currentKeyWordsHandle(
            inputValue.current.value.replace(/ |-/g, "").toLowerCase()
        );
        const genreId =
            genreListData &&
            genreListData.find((genre) => {
                return genre.name === genreValue.current.value;
            });
        currentGenreSearchHandle(genreId ? genreId.id : null);
        currentMediaTypeSearchHandle(
            mediaTypeValue.current.value !== "All"
                ? mediaTypeValue.current.value.toLowerCase()
                : null
        );
        currentLanguageSearchHandle(
            languageValue.current.value !== "Language"
                ? languageValue.current.value.toLowerCase()
                : null
        );
        if (yearValue.current.value) {
            currentYearSearchHandle(yearValue.current.value.toLowerCase());
        } else if (!yearValue.current.value) {
            currentYearSearchHandle(null);
        }
        dispatch(
            fetchToSearch({
                page: 1,
                searchValue: inputValue.current.value
                    .replace(/ |-/g, "")
                    .toLowerCase()
                    .trim(),
                genre: genreId ? genreId.id : null,
                mediaType:
                    mediaTypeValue.current.value !== "All"
                        ? mediaTypeValue.current.value.toLowerCase().trim()
                        : null,
                language:
                    languageValue.current.value !== "Language"
                        ? languageValue.current.value.toLowerCase().trim()
                        : null,

                year: yearValue.current.value
                    ? yearValue.current.value.toLowerCase().trim()
                    : null,
            })
        );
    };

    return (
        <div className={styles["contain"]}>
            <div className={styles["search-form"]}>
                <form>
                    <div className={styles.input}>
                        <input name="search" id="search" ref={inputValue} />
                        <label htmlFor="search">{searchIcon}</label>
                    </div>
                    <hr />
                    <div className={styles.button}>
                        <button type="button">RESET</button>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: "rgb(20, 20, 200)",
                                color: "white",
                            }}
                            onClick={submitHandle}
                        >
                            SEARCH
                        </button>
                    </div>
                </form>
            </div>
            <div className={styles.option}>
                <select ref={genreValue}>
                    <option>Genre</option>
                    {genreListData &&
                        genreListData.length > 0 &&
                        genreListData.map((genre) => {
                            return <option key={genre.id}>{genre.name}</option>;
                        })}
                </select>

                <select ref={mediaTypeValue}>
                    <option value="All" defaultValue>
                        All
                    </option>
                    <option value="Movie">Movie</option>
                    <option value="TV">TV</option>
                    <option value="Person">Person</option>
                </select>

                <select ref={languageValue}>
                    <option value="Language" defaultValue>
                        Language
                    </option>
                    <option value="EN">EN</option>
                    <option value="JA">JA</option>
                    <option value="KO">KO</option>
                </select>

                <input placeholder="Year" ref={yearValue} />
            </div>
        </div>
    );
};

export default SearchForm;
