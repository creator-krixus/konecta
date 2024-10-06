const app = require('./app'); // Importa la app desde app.js

const PORT = app.get('port');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});