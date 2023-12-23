// -------------------------------------------------------------------//
// --------------TẠO CÁC ROUTE KẾT NỐI CLIENT GỒM---------------------//
// -------TRENDING, TOPRATE, THỂ LOẠI GENRE, VIDEO, SEARCH------------//
// -------------------------------------------------------------------//
// --------------NẾU KHÔNG CÓ ROUTE TỒN TẠI SẼ TRẢ VỀ ----------------//
// ----------------------message:"Route not found" -------------------//
// -------------------------------------------------------------------//
// -------------KẾT NỐI MIDDLEWARE authorizator ----------------------//
// ----------ĐỂ XÁC THỰC KHI SỬ DỤNG MỘT VÀI ROUTE -------------------//
// -------------------------------------------------------------------//

const express = require("express");

const router = express.Router();

const moviesController = require("../controllers/movies");
const authorizator = require("../middleware/authenticate");

router.get("/genre-list", moviesController.genreList);
router.get(
    "/banner-movies",
    authorizator.authorizator,
    moviesController.bannerMovies
);
router.get("/api/movies/trending", moviesController.getTrending);
router.post("/api/movies/trending-post", moviesController.postTrending);
router.get("/api/movies/top-rate", moviesController.getTopRate);
router.post("/api/movies/rating-post", moviesController.postTopRate);
router.post(
    "/api/movies/search",
    authorizator.authorizator,
    moviesController.postMovieSearch
);
router.get("/api/movies/:genreType", moviesController.getGenreType);
router.post(
    "/api/movies/video",
    authorizator.authorizator,
    moviesController.postToGetVideo
);
router.post("/api/movies/:genreType", moviesController.postGenreType);

router.use((req, res, next) => {
    res.status(404).json({
        message: "Route not found",
    });
});

module.exports = router;
