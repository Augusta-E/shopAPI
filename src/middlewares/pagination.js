function paginate(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {};
        if (endIndex < (await model.countDocuments().exec())) {
            result.next = {
                page: page + 1,
                limit: limit
            };
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            };
        }
        try {
            result.result = await model.find().limit(limit).skip(startIndex);
            res.paginatedResult = result;
            next();
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    };
}

function paginatedResult(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        const result = {};

        if (endIndex < (await model.countDocuments().exec())) {
            result.next = {
                page: page + 1,
                limit: limit
            };
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            };
        }
        try {
            result.results = await model.find().limit(limit).skip(skip).exec();
            res.paginatedResult = result;
            next();
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };
}
