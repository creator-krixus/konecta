const mongoose = require('mongoose');

const SchemaProducts = mongoose.Schema({
  imagen: {
    type: String,
    required: [true, 'La imagen es requerida']
  },
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    minlength: [3, 'El nombre debe tener al menos 3 caracteres'],
    maxlength: [20, 'El nombre no puede tener más de 20 caracteres']
  },
  valor: {
    type: Number,
    required: [true, 'El valor es requerido'],
    min: [0, 'El valor no puede ser negativo'],
    validate: {
      validator: Number.isInteger,
      message: 'El valor debe ser un número entero'
    }
  },
  calificacion: {
    type: String,
    enum: {
      values: ['1', '2', '3', '4', '5'],
      message: 'La calificación debe ser un número entre 1 y 5'
    },
  }
},
  {
    timestamps: true,
    versionKey: false
  });

module.exports = mongoose.model('product', SchemaProducts);