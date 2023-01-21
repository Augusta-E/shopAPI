const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../../docs/swagger.json');

router.get('/', swaggerUi.setup(swaggerDoc));

module.exports = router;
