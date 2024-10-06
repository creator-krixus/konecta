const request = require('supertest');
const app = require('../../../src/app');
const mongoose = require('mongoose');
const schemaProducts = require('../../../src/products/models/products');

jest.mock('../../../src/products/models/products');

beforeAll(async () => {
  await mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Product Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new product', async () => {
    const newProduct = {
      nombre: 'Producto de prueba',
      imagen: 'http://example.com/image.jpg',
      valor: 100,
      calificacion: '5',
    };

    schemaProducts.mockImplementation(() => {
      return {
        save: jest.fn().mockResolvedValue(newProduct),
      };
    });

    const response = await request(app).post('/api/v1/products').send(newProduct);
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject(newProduct);
  });

  it('should get all products with pagination', async () => {
    const products = [
      { nombre: 'Producto 1', imagen: 'http://example.com/image1.jpg', valor: 100, calificacion: "5" },
      { nombre: 'Producto 2', imagen: 'http://example.com/image2.jpg', valor: 200, calificacion: "4" },
    ];

    schemaProducts.find = jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(products),
      }),
    });

    schemaProducts.countDocuments = jest.fn().mockResolvedValue(products.length);

    const response = await request(app).get('/api/v1/products?page=1&limit=2');
    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(2);
    expect(response.body.totalProducts).toBe(2);
  });


  it('should get a product by id', async () => {
    const product = {
      _id: '609b1c8f1c4a3d3e88f8b4b1',
      nombre: 'Producto 1',
      imagen: 'http://example.com/image1.jpg',
      valor: 100,
      calificacion: "5",
    };

    schemaProducts.findById.mockResolvedValue(product);

    const response = await request(app).get(`/api/v1/products/${product._id}`);
    expect(response.status).toBe(200);
    expect(response.body.nombre).toBe('Producto 1');
  });

  it('should update a product by id', async () => {
    const productId = '609b1c8f1c4a3d3e88f8b4b1';
    const updatedData = {
      nombre: 'Producto 1 Actualizado',
      imagen: 'http://example.com/image1_updated.jpg',
      valor: 150,
      calificacion: "4",
    };

    schemaProducts.findByIdAndUpdate.mockResolvedValue({
      ...updatedData,
      _id: productId,
    });

    const response = await request(app).put(`/api/v1/products/${productId}`).send(updatedData);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Producto actualizado con éxito');
  });

  it('should delete a product by id', async () => {
    const productId = '609b1c8f1c4a3d3e88f8b4b1';

    schemaProducts.findByIdAndDelete.mockResolvedValue({ _id: productId });

    const response = await request(app).delete(`/api/v1/products/${productId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Producto eliminado con éxito');
  });
});
