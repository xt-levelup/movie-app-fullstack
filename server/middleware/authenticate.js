// ---------------------------------------------------------------------//
// ------------------MIDDLEWARE XỬ LÝ CƠ CHẾ XÁC THỰC------------------//
// --------------------------------------------------------------------//

const Movies = require("../models/movies");

exports.authorizator = (req, res, next) => {
    const getToken = req.headers["authorization"];
    const user = req.headers.user;
    const token = getToken && getToken.split(" ")[1];

    if (getToken && user && token) {
        Movies.fetchTokenData((tokenData) => {
            if (
                tokenData.find((data) => {
                    return data.userId === user && data.token === token;
                })
            ) {
                next();
            } else {
                res.status(401).json({
                    message: "Unauthorized",
                });
            }
        });
    } else {
        res.status(401).json({
            message: "Unauthorized",
        });
    }
};
