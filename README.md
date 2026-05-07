# 🍹 ZOCO Project

<div align="center">
  <h3>Sistema Automatizado de Gestión de Bares y Eventos en Tucumán</h3>
  <p>Una plataforma end-to-end con arquitectura limpia, frontend moderno y automatización de scraping de datos.</p>
  <br />
  <p>
    <strong>Repositorio Frontend:</strong> <a href="https://github.com/mauroarmas/zoco-prueba-frontend">mauroarmas/zoco-prueba-frontend</a>
  </p>
</div>



## ✨ Características Principales

- 🔄 **Scraping Automatizado:** Integración con n8n para extraer datos de bares y eventos de fuentes externas mediante llamadas HTTP.
- 🛡️ **Prevención de Duplicados:** Algoritmo inteligente que genera un `hash_identificador` (slug normalizado, sin acentos ni *stop words*) para realizar operaciones `upsert` y evitar entradas repetidas.
- 🏗️ **Clean Architecture:** Backend estructurado en capas estandarizadas (Presentación, Negocio, Persistencia) garantizando alta escalabilidad, modularidad y bajo acoplamiento.
- 🗑️ **Soft Delete:** Borrado lógico (`isActive: false`) en lugar de eliminación física para preservar el historial y la integridad de los datos.
- 🎨 **Dashboard Interactivo:** Interfaz gráfica reactiva con filtrado dinámico por categorías, búsqueda en tiempo real, edición en sitio y desactivación de registros.
- - 📢 **Notificaciones por Slack:** Se envían alertas automáticas por Slack únicamente cuando se detectan e ingresan nuevos bares (se omiten las modificaciones) durante la ejecución del workflow de scraping.



## 🎥 Demostración del Flujo de Trabajo

A continuación, puedes ver un video explicativo donde se detalla el flujo de trabajo completo de la aplicación, incluyendo el scraping automatizado y la gestión desde el dashboard:

[![Demostración ZOCO Bares](https://img.youtube.com/vi/XfQRkzKJQ6A/0.jpg)](https://www.youtube.com/watch?v=XfQRkzKJQ6A)

---

## 🛠️ Stack Tecnológico

El proyecto está dividido en tres pilares fundamentales:
1. **Frontend (React + Tailwind CSS):** Un dashboard moderno para visualizar, buscar, filtrar y gestionar los bares.
2. **Backend (NestJS + MongoDB):** Una API RESTful robusta bajo principios de Clean Architecture que maneja la lógica de negocio y la persistencia de datos.
3. **Automatización (n8n):** Flujos de trabajo automatizados para el scraping de información externa, integrados directamente con el backend.


## 📂 Estructura del Proyecto

```text
ZOCO-PROJECT/
├── zoco-backend/                 # API RESTful (NestJS)
│   ├── src/
│   │   ├── business/             # Lógica de Negocio (Modelos de Dominio)
        │   ├── entitys/service   # Entidades y Clases del sistema, así como sus servicios
│   │   ├── persistence/          # Capa de Datos (Mongoose Schemas, Repositorios)
│   │   ├── presentation/         # Controladores REST, DTOs
│   │   └── config/               # Variables de Entorno y Configuración
│   └── package.json
│
├── zoco-frontend/                # Cliente Web (React) - [Ver Repositorio](https://github.com/mauroarmas/zoco-prueba-frontend)
│   ├── src/
│   │   ├── components/       # Componentes UI (Dashboard, BarCard)
│   │   ├── App.jsx           # Componente Root
│   │   └── index.css         # Tailwind Directives
│   └── package.json
│
└── zocoWorkflow-n8n.json         # Workflow exportado de n8n (Scraping)
```

---

## 🚀 Instalación y Despliegue Local

### Requisitos Previos
- Node.js (v18+)
- MongoDB Atlas (URI de conexión)
- n8n (Instancia Local o Cloud)

### 1. Configuración del Backend

```bash
cd zoco-backend
npm install
```

Crea un archivo `.env` en la raíz de `zoco-backend` con las siguientes variables:
```env
MONGO_URI=tu_mongodb_atlas_uri
PORT=4000
```

Inicia el servidor en modo desarrollo:
```bash
npm run start
# La API correrá en http://localhost:4000
```

### 2. Configuración del Frontend

Puedes encontrar el código fuente y las instrucciones de instalación detalladas del frontend en su propio repositorio:
👉 [https://github.com/mauroarmas/zoco-prueba-frontend](https://github.com/mauroarmas/zoco-prueba-frontend)

### 3. Configuración de n8n

1. Asegúrate de tener una instancia de n8n corriendo.
2. Ve a la interfaz de n8n y crea un nuevo workflow.
3. Arriba a la derecha, haz clic en el menú (tres puntos) y selecciona **Import from File**.
4. Selecciona el archivo `zocoWorkflow-n8n.json` ubicado en la raíz de este repositorio.
5. Activa el workflow para habilitar el scraping automático.

---

## 📡 Endpoints Principales de la API

La API expone sus servicios REST bajo el prefijo configurado (por ejemplo, para interactuar con los bares):

| Método | Endpoint                 | Descripción                                          |
|--------|--------------------------|------------------------------------------------------|
| `GET`  | `/api/bars`              | Obtiene todos los bares (activos e inactivos).       |
| `GET`  | `/api/bars/:id`          | Obtiene los detalles de un bar o evento específico.  |
| `POST` | `/api/bars`              | Crea un nuevo bar (ejecuta Upsert para no duplicar). |
| `PUT`  | `/api/bars/:id`          | Actualiza la información de un bar existente.        |
| `DELETE`| `/api/bars/:id`         | Realiza un borrado lógico (Soft Delete).             |
| `POST` | `/api/bars/trigger-scraping`| Dispara el flujo de n8n para iniciar un nuevo proceso de scraping pasándole un `pageNumber`. |

---

## 🧠 Decisiones de Arquitectura Clave

- **Desacoplamiento Frontend/Scraping:** El frontend de React **nunca** se comunica directamente con n8n. Toda petición pasa obligatoriamente por el backend NestJS (Arquitectura Cliente-Servidor clásica) para garantizar seguridad, aplicar rate limits y centralizar la validación de datos.
- **Normalización de Nombres (Hash Generador):** Antes de guardar o procesar en la Base de Datos, la API toma el nombre ingresado, elimina tildes, caracteres especiales y "palabras vacías" o *stop words* ("el", "la", "de", "tucuman", etc.) para generar un identificador único seguro (slug). Gracias a esto, textos como *"El Bar de Homero"* y *"Bar Homero"* se resuelven automáticamente como la misma entidad, evitando de raíz datos duplicados durante el scraping.
- **Clean Architecture en NestJS:** La separación estricta entre `Presentation` (Controladores), `Business` (Servicios, Dominio) y `Persistence` (Mongoose) asegura que si el día de mañana se cambia MongoDB por PostgreSQL, la lógica de negocio y los controladores quedarán totalmente intactos.
