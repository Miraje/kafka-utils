# Kafka Utils

This application includes is a component designed to interact with Kafka clusters. Its current functionality allows users to view messages by providing a configuration. This is intended to simplify Kafka debugging and monitoring tasks. Future enhancements will add more features, such as producing messages and detailed consumer group information.

## Current Features:
- View Kafka messages using a configuration.
- Produce Kafka messages directly from the application.

## Planned Features:
- Monitor and analyze consumer groups.

---

# Usage guide

This guide outlines the steps to run the application in different modes: using Docker Compose for production, using a development setup, or launching each component manually. 


## Overview

This application consists of a Frontend (FE) and a Backend (BE), orchestrated with Docker Compose. 

Three primary modes are available for running the application:

1. **Production Mode**: Uses the main `compose.yaml` file to run the application with pre-built images.
2. **Development Mode**: Utilizes the `compose.dev.yaml` development-specific Docker Compose file for live development and testing.
3. **Manual Launch**: The User starts each component independently without Docker Compose.

The Backend code is located inside `kafka-utils-be` and is developed using `Kotlin` and `gradle`.

The Frontend code is located inside `kafka-utils-fe` and is developed using `Angular` and `gradle`.

## Prerequisites

According to the usage mode pretended, ensure the following tools are installed on your system:

* Production mode:
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)

* Development mode:
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)

* Manual mode:
  - [Docker](https://www.docker.com/)
  - [Docker Compose](https://docs.docker.com/compose/)
  - [Node.js](https://nodejs.org/) (to launch the Frontend manually)
  - [Kotlin](https://kotlinlang.org/) (or the required runtime for the Backend)

## Usage Modes

### 1. Production Mode

To run the application in production mode:

1. Build and run the services using Docker Compose:
   ```bash
   docker compose pull
   docker compose up
   ```
   Or
   ```bash
   docker compose pull
   docker compose up -d
   ```

2. Verify the services are running:
   ```bash
   docker compose ps
   ```
3. Access the application:
   - Frontend: `http://localhost:4300`
   - Backend: `http://localhost:8083`

To stop the services:
```bash
docker compose down
```

### 2. Development Mode

For development purposes, use the development-specific Docker Compose file. This setup allows hot-reloading.

1. Start the services using the development configuration:
   ```bash
   docker compose -f .\compose.dev.yaml up --build --watch
   ```
2. Access the application:
   - Frontend: `http://localhost:4300`
   - Backend: `http://localhost:8083`


### 3. Manual Launch

In this mode, each component is launched manually. This is useful for debugging or running the application without Docker.

#### Frontend

1. Navigate to the Frontend directory:
   ```bash
   cd kafka-utils-fe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend server:
   ```bash
   npm start
   ```
4. Access the frontend at `http://localhost:4200`.

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd kafka-utils-be
   ```
2. Build the application:
   ```bash
   ./gradlew build
   ```
3. Run the backend application:
   ```bash
   java -jar build/libs/kafka-utils-all.jar
   ```
4. Access the backend at `http://localhost:8083`.