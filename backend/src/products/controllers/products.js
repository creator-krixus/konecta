const schemaProducts = require('../models/products');

const controller = {}

controller.createNewProduct = async (req, res) => {
  try {
    const productData = schemaProducts(req.body);
    const newProduct = await productData.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Error al crear el producto', error: error.message });
  }
}


controller.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.name ? { nombre: new RegExp(req.query.name, 'i') } : {};

    const products = await schemaProducts.find(searchTerm)
      .skip(skip)
      .limit(limit);

    const totalProducts = await schemaProducts.countDocuments(searchTerm);
    const totalPages = Math.ceil(totalProducts / limit);
    res.status(200).json({
      page,
      totalPages,
      totalProducts,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

controller.getById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await schemaProducts.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};


controller.updateProductById = async (req, res) => {
  const { id } = req.params;
  const { imagen, nombre, valor, calificacion } = req.body;

  try {
    const product = await schemaProducts.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const updatedProduct = await schemaProducts.updateOne(
      { _id: id },
      { $set: { imagen, nombre, valor, calificacion } }
    );

    res.status(200).json({ message: 'Producto actualizado con éxito', updatedProduct });
  } catch (error) {

    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};


controller.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await schemaProducts.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    await schemaProducts.deleteOne({ _id: id });
    res.status(200).json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};


module.exports = controller;