# Nombre del Proyecto

Pequeño proyecto para la creacion usuarios empleados y administradores los cuales tiene funciones especificas los administardores
pueden crear nuevos empleados y administradores, editar eliminar y ver la lista completa de usurios, los usuarios empleeados solo pueden ingresar a la app a ver y crear productos
los administradores por su parte si pueden crear, listar, editar y eliminar productos


## Tabla de Contenidos
1. [Instalación](#instalación)
2. [Uso](#uso)
3. [Contribuir](#contribuir)

## Instalación

### Requisitos previos
- Tener Docker y Docker Compose instalados en tu máquina:
  - [Docker](https://www.docker.com/get-started)
  - [Docker Compose](https://docs.docker.com/compose/install/)

### Paso a paso

1. Clona este repositorio:
   ```bash
  git clone https://github.com/usuario/nombre-del-proyecto.git](https://github.com/creator-krixus/konecta.git

2. Entra en el directorio del proyecto:
    cd konect
   
4. En la carpeta raiz incluir este archivo .env:
  URL_DB=mongodb+srv://wilson:Prueba123@cluster0.gzmra.mongodb.net/konecta?retryWrites=true&w=majority&appName=Cluster0
  API_URL_USERS=http://localhost:7000/api/v1/users
  API_URL_PRODUCTS=http://localhost:7000/api/v1/products
  API_APIK_KEY=AIzaSyAgdRyxdvBsk1fJ050QcsM-_vl_1PsaE44
  API_AUTH_DOMAIN=save-images-544a9.firebaseapp.com
  API_PROJECTID=save-images-544a9
  API_STORAGE_BUCKET=save-images-544a9.appspot.com
  API_MESSAGING_SENDER_ID=339689732811
  API_APP_ID=1:339689732811:web:3434285dc5b59e0a83394e
  API_MEASUREMENT_ID=G-HL3NY8N5W1

5. En la carpeta del frontend incluir este .env
  VITE_API_URL_USERS=http://localhost:7000/api/v1/users
  VITE_API_URL_PRODUCTS=http://localhost:7000/api/v1/products
  VITE_API_APIK_KEY=AIzaSyAgdRyxdvBsk1fJ050QcsM-_vl_1PsaE44
  VITE_API_AUTH_DOMAIN=save-images-544a9.firebaseapp.com
  VITE_API_PROJECTID=save-images-544a9
  VITE_API_STORAGE_BUCKET=save-images-544a9.appspot.com
  VITE_API_MESSAGING_SENDER_ID=339689732811
  VITE_API_APP_ID=1:339689732811:web:3434285dc5b59e0a83394e
  VITE_API_MEASUREMENT_ID=G-HL3NY8N5W1
  
6. En la del backend incluir este .env
   URL_DB=mongodb+srv://wilson:Prueba123@cluster0.gzmra.mongodb.net/konecta?retryWrites=true&w=majority&appName=Cluster0
   SIGNATURE=23"

7. Construye y ejecuta los contenedores con Docker Compose:
   docker-compose up --build   
  
