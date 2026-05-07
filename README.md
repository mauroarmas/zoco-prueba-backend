# 🍹 ZOCO Project

<div align="center">
  <h3>Sistema Automatizado de Gestión de Bares y Eventos en Tucumán</h3>
  <p>Una plataforma end-to-end con arquitectura limpia, frontend moderno y automatización de scraping de datos.</p>
  <br />
  <p>
    <strong>Repositorio Frontend:</strong> <a href="https://github.com/mauroarmas/zoco-prueba-frontend">mauroarmas/zoco-prueba-frontend</a>
    <strong>Export del flujo de trabajo:</strong> <p>Dentro del directorio raíz del proyecto, archivo "zocoWorkflow-n8n.json</p>
  </p>
</div>



## ✨ Características Principales

- 🔄 **Scraping Automatizado:** Integración con n8n para extraer datos de bares y eventos de fuentes externas mediante llamadas HTTP.
- 🛡️ **Prevención de Duplicados:** Algoritmo inteligente que genera un `hash_identificador` (slug normalizado, sin acentos ni *stop words*) para realizar operaciones `upsert` y evitar entradas repetidas.
- 🏗️ **Clean Architecture:** Backend estructurado en capas estandarizadas (Presentación, Negocio, Persistencia) garantizando alta escalabilidad, modularidad y bajo acoplamiento.
- 🗑️ **Soft Delete:** Borrado lógico (`isActive: false`) en lugar de eliminación física para preservar el historial y la integridad de los datos.
- 🎨 **Dashboard Interactivo:** Interfaz gráfica reactiva con filtrado dinámico por categorías, búsqueda en tiempo real, edición en sitio y desactivación de registros.
- 📢 **Notificaciones por Slack:** Se envían alertas automáticas por Slack únicamente cuando se detectan e ingresan nuevos bares (se omiten las modificaciones) durante la ejecución del workflow de scraping.
- ✨ **Categorización de Bares y autocompletado de descripciones:** Se envían las descripciones inconclusas de los bares a la api de Gemini y esta la completa brevemente y categoriza a los bares.

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

## 🧠 Decisiones de Arquitectura Clave (Criterio Técnico)

- **Evitación de Duplicados mediante Normalización de Nombres (Hash Generador):** Antes de guardar o procesar en la Base de Datos, la API toma el nombre ingresado, elimina tildes, caracteres especiales y "palabras vacías" o *stop words* ("el", "la", "de", "tucuman", etc.) para generar un identificador único seguro (slug). Gracias a esto, textos como *"El Bar de Homero"* y *"Bar Homero"* se resuelven automáticamente como la misma entidad, evitando de raíz datos duplicados durante el scraping.
- **Sistema escalable:** 
- - Escalaría este sistema con la funcionalidad de traer bares de distintas provincias, usaría otra API (por ejemplo google maps) para este propósito.
- - También añadiria verificaciones de la existencia de bares, por ejemplo busqueda en redes sociales o mensajes automatizados a la misma con el propósito de saber si todavía trabajan, muchos de los bares cargados son antiguos.
- - Añadiría un bot que obtenga la carta de los bares actualizada de los bares que la tengan disponible, para mostrar precios actualizados y hacer busquedas de productos (pizzas, hamburguesas, etc..) para comparar precios de las distintas opciones.
- - Implementaria un filtrado por ubicación, donde según desde dónde esté consultando muestre bares cercanos a un radio personalizado.
- **Problemas posibles del flujo**:
- - **Alta dependencia a la página web**: Para el scrapping se hace selección de etiquetas CSS, si estas o su html son cambiados el flujo se rompería o si el dominio de la página es modificado.
- - **Alta dependencia de la API Google Gemini**: Si el LLM presenta alucinaciones puede categorizar mal los bares o si este no está disponible el flujo no podría ejecutarse.
- **Mejora de calidad de datos:**
- - **Estandarización de ubicaciones:** Actualmente el sistema obtiene ubicaciones como "San Miguel de Tucumán" o "Octaviano Vera 894" que son imprecisas. Conectaría el flujo de n8n a la API de Google Maps para convertir esos strings de texto en coordenadas geoespaciales exactas (latitud y longitud) o direcciones estandarizadas que esta API entrega.
- - **Ampliación de descripciones:** Haría que el agente entre a cada uno de los bares (no se quede solo con la card) y obtenga más datos que la página web proporciona.
- - **Bot de comunicación con los propietarios:** Si en la página existe un contacto, lo usaria para enviar por ejemplo Whatsapps para que haciendo preguntas específicas pueda recolectar información más rica.
- **Desacoplamiento Frontend/Scraping:** El frontend de React **nunca** se comunica directamente con n8n. Toda petición pasa obligatoriamente por el backend NestJS (Arquitectura Cliente-Servidor clásica) para garantizar seguridad, aplicar rate limits y centralizar la validación de datos.
- **Clean Architecture en NestJS:** La separación estricta entre `Presentation` (Controladores), `Business` (Servicios, Dominio) y `Persistence` (Mongoose) asegura que si el día de mañana se cambia MongoDB por PostgreSQL, la lógica de negocio y los controladores quedarán totalmente intactos.

