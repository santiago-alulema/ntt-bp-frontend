#  Financial Products Frontend — Angular

Aplicación frontend desarrollada en Angular para la gestión de productos financieros de un banco.

La solución cumple los requerimientos de la prueba técnica: listado, búsqueda, creación, edición y eliminación de productos, aplicando buenas prácticas de arquitectura, UX y manejo de errores visuales.

---

## 🚀 Tecnologías utilizadas

- Angular 21
- TypeScript (strict mode)
- Angular Router
- HttpClient + Interceptors
- Vitest + Testing Library (unit testing)
- CSS puro (sin frameworks externos)

---

## 📦 Ejecución del proyecto

### 1) Backend requerido

La prueba consume un backend local en Node.js provisto en el ejercicio.

Ejecutar:

```bash
npm i
```
```bash
npm run start:dev
```

El backend se levantará en:

```
http://localhost:3002
```

---

### 2) Ejecutar frontend

```bash
npm i
```
```bash
ng serve -o
```

Abrir:

```
http://localhost:4200
```

---

## 🔧 Proxy para CORS (solo desarrollo)

Debido a que el backend corre en otro puerto, se configuró un proxy de Angular para evitar problemas de CORS durante el desarrollo.

`proxy.conf.json`

```json
{
  "/bp": {
    "target": "http://localhost:3002",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```


Este proxy:

* Solo funciona con `ng serve`
* No se incluye en producción
* No altera la lógica de la prueba (solo facilita debugging)

---

## 🧠 Arquitectura

```
app
 ├─ core
 │   ├─ interceptors
 │   ├─ services
 │   └─ pages (global pages: not-found)
 │
 ├─ features
 │   └─ products
 │        ├─ pages
 │        ├─ services
 │        ├─ models
 │        └─ config
 │
 │─ shared
 │   ├─ components
 │   └─ ui
 │
 └ environments
     ├─ environment.ts
     └─ environment.prod.ts  
```

Se aplicó separación por responsabilidades:

* **core** → lógica transversal de la app
* **features** → dominio funcional (products)
* **shared** → componentes reutilizables

---

## 📋 Funcionalidades implementadas

### F1 — Listado de productos

* Consumo de API `/bp/products`
* Grid reutilizable
* Skeleton de carga

### F2 — Búsqueda

* Filtrado en tiempo real
* Normalización de texto (case insensitive)

### F3 — Cantidad de registros

* Selector: 5, 10 y 20 resultados
* Paginación controlada por el usuario

### F4 — Crear producto

Validaciones:

* ID requerido (3–10 caracteres)
* Verificación de existencia vía endpoint
* Nombre (5–100)
* Descripción (10–200)
* Fecha liberación >= hoy
* Fecha revisión = +1 año

Mensajes de error visual por campo.

### F5 — Editar producto

* Navegación por ruta `/product/edit/:id`
* ID deshabilitado
* Reutilización del formulario
* Menú contextual por fila

### F6 — Eliminar producto

* Modal de confirmación
* Cancelar / Eliminar
* Feedback visual

---

## ⚠️ Manejo de errores

* Interceptor global de errores HTTP
* Mensajes visuales
* Página **Not Found** si se accede a un ID inexistente

---

## 🛡️ Resiliencia de UI

El campo `logo` se interpreta como la URL de una imagen.

* Si la URL es inválida, se muestra una imagen por defecto.
* Si la URL es válida pero corresponde a un recurso que no es una imagen (por ejemplo una página web), el campo se deja en blanco.

Esto evita errores visuales y mantiene estable la interfaz.

---

## 📌 Notas

El proxy configurado no forma parte de la solución funcional, únicamente evita CORS en entorno de desarrollo al consumir el backend local solicitado por la prueba.

---

## 🧪 Ejecutar pruebas

Ejecutar todas las pruebas:

```bash
npm run test
```
```bash
npm run test:cov
```
Objetivo: ≥70% coverage.
