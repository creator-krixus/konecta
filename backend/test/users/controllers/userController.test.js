const request = require('supertest');
const app = require('../../../src/app');
const jwt = require('jsonwebtoken');
const userSchema = require('../../../src/users/models/users');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../../../src/users/models/users');

beforeAll(async () => {
  await mongoose.connect(process.env.URL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

jest.mock('../../../src/app', () => {
  const app = jest.requireActual('../../../src/app');
  app.listen = jest.fn();
  return app;
});

describe('User Controller - createUser', () => {
  it('debería crear un usuario correctamente', async () => {
    userSchema.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue('hashedPassword');
    const mockSave = jest.fn().mockResolvedValue({
      nombre: 'Test User',
      email: 'test@example.com',
      role: 'user',
    });

    userSchema.mockImplementation(() => ({ save: mockSave }));
    jwt.sign.mockReturnValue('mockToken');
    const response = await request(app)
      .post('/api/v1/users/register')
      .send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '123456',
        role: 'user',
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      isOk: true,
      msg: 'User created successfully',
      user: { nombre: 'Test User', email: 'test@example.com', role: 'user' },
      token: 'mockToken',
    });

    expect(userSchema.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    expect(mockSave).toHaveBeenCalled();
  });

  it('debería retornar error si las contraseñas no coinciden', async () => {
    const response = await request(app)
      .post('/api/v1/users/register')
      .send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '654321',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ isOk: false, msg: 'Passwords do not match' });
  });

  it('debería retornar error si el usuario ya existe', async () => {
    userSchema.findOne.mockResolvedValue({ email: 'test@example.com' });

    const response = await request(app)
      .post('/api/v1/users/register')
      .send({
        nombre: 'Test User',
        email: 'test@example.com',
        password: '123456',
        confirmPassword: '123456',
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ isOk: false, msg: 'User already exists' });
  });
});

describe('User Controller - loginUser', () => {
  it('debería iniciar sesión correctamente', async () => {
    userSchema.findOne.mockResolvedValue({
      _id: 'userId',
      nombre: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user',
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mockToken');

    const response = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'test@example.com', password: '123456' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      isOk: true,
      user: {
        _id: 'userId',
        nombre: 'Test User',
        email: 'test@example.com',
        role: 'user',
        token: 'mockToken',
      },
    });
  });

  it('debería retornar error si las credenciales son inválidas', async () => {
    userSchema.findOne.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/v1/users/login')
      .send({ email: 'invalid@example.com', password: '123456' });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ isOk: false, msg: 'Invalid credentials' });
  });
});

describe('User Controller - getAllUsers', () => {
  let userSchema;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    jest.mock('../../../src/users/models/users', () => ({
      find: jest.fn().mockResolvedValue([{ _id: 'userId', nombre: 'Test User', email: 'test@example.com', role: 'user' }]),
      countDocuments: jest.fn().mockResolvedValue(1),
    }));

    userSchema = require('../../../src/users/models/users');
  });

  it('debería obtener todos los usuarios correctamente', async () => {
    const response = await request(app).get('/api/v1/users');
    expect(response.status).toBe(200);
  });
});

describe('User Controller - getOneUser', () => {
  let userSchema;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('debería retornar 404 si el usuario no es encontrado', async () => {
    userSchema = require('../../../src/users/models/users');
    jest.mock('../../../src/users/models/users', () => ({
      findById: jest.fn(),
    }));
    const validUserId = '507f191e810c19729de860ea';
    userSchema.findById.mockResolvedValue(null);
    const response = await request(app).get(`/api/v1/users/${validUserId}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      isOk: false,
      msg: 'User not found',
    });
  });

  it('debería retornar 400 si el ID es inválido', async () => {
    userSchema = require('../../../src/users/models/users');
    jest.mock('../../../src/users/models/users', () => ({
      findById: jest.fn(),
    }));
    const invalidUserId = 'invalidUserId123';
    const response = await request(app).get(`/api/v1/users/${invalidUserId}`);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      isOk: false,
      errors: expect.any(Array),
    });
  });
});












