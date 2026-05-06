# Prueba Técnica: Automatización de Eventos y Bares (Backend)

Este repositorio contiene la implementación del Backend en NestJS para la Prueba Técnica. El objetivo de este sistema es obtener, procesar y administrar eventos/bares de Tucumán mediante automatizaciones, IA y una API RESTful.

## 🚀 Arquitectura y Tecnologías
- **Backend Framework:** NestJS (Node.js)
- **Base de Datos:** MongoDB (a través de Mongoose)
- **Automatización & Scraping:** n8n (flujo externo que envía los datos aquí)
- **Validación de Datos:** class-validator
- **Control de Duplicados Difusos:** string-similarity

## 📌 Criterios Técnicos (Respuestas a la Consigna)

### 1. ¿Cómo evitás duplicados?
Implementamos una validación basada en **Slugs Alfabéticos** y **Upserts en MongoDB**:
- **Generación de Hash:** Cuando recibimos el payload desde n8n, pasamos el nombre por una función que lo pasa a minúsculas, quita acentos, elimina palabras vacías ("el", "la", "de", "tucuman", etc.) y luego separa las palabras, las ordena alfabéticamente y las vuelve a unir con guiones.
- **Ejemplo Práctico:** "Bar Irlanda Tucumán" y "Irlanda Bar" resultan ambos en el mismo hash: `bar-irlanda`.
- **Upsert Atómico:** En MongoDB, guardamos este resultado en `hash_identificador` con un índice `unique: true`. Al momento de guardar, en lugar de usar un `.save()`, ejecutamos un `findOneAndUpdate` con la opción `upsert: true`. Si el bar ya existe, se actualiza silenciosamente; si no existe, se crea. Esto es extremadamente rápido y no requiere librerías pesadas ni llamados a IA.

### 2. ¿Cómo escalarías este sistema?
- **Desacoplamiento con Colas (Message Brokers):** En lugar de que n8n llame al endpoint POST de forma sincrónica para cada evento, podríamos usar RabbitMQ o Kafka. n8n enviaría los datos scrapeados a una cola, y un worker en NestJS procesaría y guardaría a su propio ritmo.
- **Bases de Datos:** Migraríamos la validación de duplicados difusa hacia herramientas especializadas como Elasticsearch o Redis (para caching de eventos recientes).
- **Despliegue:** Dockerizar la aplicación y orquestarla en Kubernetes para tener auto-scaling en los pods de procesamiento, y utilizar un clúster de MongoDB Atlas.

### 3. ¿Qué problemas puede tener este flujo?
- **Cambio de Estructura (Scraping Frágil):** Si la web fuente de los eventos cambia su HTML o estructura, el flujo de n8n fallará.
- **Falsos Positivos en Similitud:** Un umbral fijo de 65% en la similitud podría marcar como duplicados a eventos distintos con nombres muy parecidos (ej. "Bar El Drugstore I" vs "Bar El Drugstore II").
- **Tasa de Peticiones (Rate Limits):** Si se procesan miles de bares de golpe, n8n podría hacer miles de peticiones seguidas, saturando nuestro backend o excediendo límites si usamos llamadas a APIs de IA externas (como OpenAI) por cada barra.

### 4. ¿Cómo mejorarías la calidad de los datos?
- **IA Generativa en el Backend:** Además de lo implementado, pasaríamos la descripción y nombre por un LLM (OpenAI) para extraer el horario de atención exacto, estandarizar el formato de la ubicación y limpiar caracteres extraños.
- **Normalización de Direcciones:** Conectar el flujo con Google Maps API para obtener las coordenadas (lat, lng) y la dirección postal estandarizada, en lugar de guardar strings arbitrarios.
- **Human-in-the-loop (Aprobación):** Añadir un estado de `pending` a los eventos nuevos, que requiera que un moderador (a través de un dashboard admin) apruebe los datos antes de que se hagan públicos.

---

## 🛠 Instalación y Ejecución

```bash
# Instalar dependencias
$ npm install

# Iniciar servidor en modo desarrollo
$ npm run start:dev
```

## 🌐 Endpoints Principales (CRUD)
- `GET /bars`: Lista todos los bares.
- `GET /bars/:id`: Obtiene el detalle de un bar.
- `POST /bars`: Crea un bar (utilizado por n8n). Si el bar ya existe (mismo hash_identificador), lo actualiza en silencio.
- `PUT /bars/:id`: Actualiza la información de un bar.
- `DELETE /bars/:id`: Realiza un soft-delete (lo desactiva).
