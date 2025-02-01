
// Centralized error-handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(`\x1b[31m❌ SOMETHING WENT WRONG!\n ${err.stack} \x1b[0m`); // Red text

    // Custom error handling based on the error message
    if (err.message === "Unsupported state or unable to authenticate data") {
        return res.status(400).send({ message: "Invalid data received!" });
    }

    // Default error response
    res.status(500).send({ message: "Something went wrong!" });
};

// export the error handler
export default errorHandler;
