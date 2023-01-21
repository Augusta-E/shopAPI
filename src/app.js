const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const config = require('./config/index');
const { connectDB } = require('./config/database/connectDB');
const seedAdmin = require('./config/database/seedAdmin');
const routes = require('./routes/index');
const { notFound } = require('./middlewares/errors/notFound');
const errorHandler = require('./middlewares/errors/errorHandler');

const app = express();

// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.use(express.json());

const PORT = config.app.port || 3000;

app.use('/api/v1', routes);

app.use(errorHandler);
app.use(notFound);

connectDB(async () => {
    //await seedAdmin();
    app.listen(PORT, () => {
        console.log(`\n::: Server running on port ${PORT} :::`);
    });
});
