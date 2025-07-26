# Node Store API 🛒
API RESTful construida con Node.js y Express para manejar productos y carritos de compra. Persistencia en archivos JSON.

## 🚀 Requisitos de la entrega
Este proyecto cumple con los siguientes puntos:
- Manejo de productos con endpoints CRUD.
- Manejo de carritos de compra.
- Persistencia en sistema de archivos (`products.json` y `carts.json`).
- Separación lógica en routers y managers.
- Uso de clases: `ProductManager` y `CartManager`.
---
## 📁 Estructura del Proyecto
/src

/managers

ProductManager.js

CartManager.js

/routes

products.router.js

carts.router.js

/data

products.json

carts.json

app.js

package.json

---
## 📦 Instalación y ejecución

```bash
npm install
node src/app.js
http://localhost:8080

🔌 Rutas disponibles
/api/products/
GET / → Obtener todos los productos.
GET /:pid → Obtener producto por ID.
POST / → Crear un nuevo producto.
PUT /:pid → Actualizar producto.
DELETE /:pid → Eliminar producto.
/api/carts/
POST / → Crear nuevo carrito.
GET /:cid → Ver productos en un carrito.
POST /:cid/product/:pid → Agregar producto a un carrito.

🧠 Autor
Proyecto creado por roegomez para el curso de Programación Backend I: Desarrollo Avanzado de Backend - CODERHOUSE




