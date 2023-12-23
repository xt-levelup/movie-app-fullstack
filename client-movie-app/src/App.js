// ----------------------------------------------------------------------//
// ---------------SỬ DỤNG REACT-ROUTER ĐỂ TẠO KẾT CẤU TRANG--------------//
// -----------SỬ DỤNG lazy, Suspense ĐỂ TẢI TRANG KHI CẦN THIẾT----------//
// ----------------------------------------------------------------------//

import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import { lazy, Suspense } from "react";

const MainLayout = lazy(() => {
    return import("./layout/MainLayout.js");
});
const HomePage = lazy(() => {
    return import("./pages/HomePage.js");
});
const SearchPage = lazy(() => {
    return import("./pages/SearchPage.js");
});

function App() {
    const loading = <p>Page is loading...</p>;
    const router = createBrowserRouter([
        {
            path: "/",
            element: <MainLayout />,
            children: [
                {
                    // path: "/",
                    index: true,
                    element: <Navigate to="/type/trending" replace />,
                },
                {
                    path: "/type/:movieType",

                    element: (
                        <Suspense fallback={loading}>
                            <HomePage />
                        </Suspense>
                    ),
                },
                {
                    path: "/search",
                    element: (
                        <Suspense fallback={loading}>
                            <SearchPage />
                        </Suspense>
                    ),
                },

                {
                    path: "*",
                    element: <Navigate to="/type/no-params" />,
                },
            ],
        },
    ]);

    return <RouterProvider router={router} />;
}

export default App;
