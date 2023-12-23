import { Outlet, NavLink, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

import styles from "./MainLayout.module.css";

const MainLayout = () => {
    const [backgroundNavbar, setBackgroundNavbar] = useState("");
    const [scrollY, setScrollY] = useState(window.scrollY);
    const params = useParams();

    const searchIcon = (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
        </svg>
    );

    const scrollYHandle = () => {
        setScrollY(window.scrollY);
        if (window.scrollY > 100) {
            setBackgroundNavbar("black");
        } else {
            setBackgroundNavbar("");
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", scrollYHandle);
        return () => {
            window.removeEventListener("scroll", scrollYHandle);
        };
    }, []);

    return (
        <div className={styles.contain}>
            <nav
                style={{ backgroundColor: backgroundNavbar }}
                className={styles.nav}
            >
                <NavLink
                    to="/"
                    className={({ isActive }) => {
                        return isActive ? styles.active : undefined;
                    }}
                    end
                >
                    Movie App
                </NavLink>
                <NavLink
                    to="/search"
                    className={({ isActive }) => {
                        return isActive ? styles.active : undefined;
                    }}
                >
                    {searchIcon}
                </NavLink>
            </nav>

            <Outlet />
        </div>
    );
};

export default MainLayout;
