exports.notFound = (req, res, next) => {
    res.status(404).send({
        status: 404,
        error: 'Route not found'
    });
};
