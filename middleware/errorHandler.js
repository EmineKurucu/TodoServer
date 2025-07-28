const errorHandler = (req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        status : "error",
        success : false,
        message : errorHandler.message || "Internal Server Error",
        data : null,
        error : process.env.NODE_ENV === "development" ? err + err.stack : {},
    });
};

module.exports = {errorHandler};