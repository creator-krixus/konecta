const express = require('express');
const router = express.Router();
const controller = require('../controllers/products')

router.post('/', controller.createNewProduct)
router.get('/', controller.getAllProducts)
router.get('/:id', controller.getById)
router.put('/:id', controller.updateProductById)
router.delete('/:id', controller.deleteProduct)

module.exports = router