# Product Requirements Document: Self-Hosted Magic Component Server

## 1. Overview

This document outlines the requirements for creating a self-hosted version of the Magic Component Platform (MCP) server. The goal is to build a custom backend service to host a private library of UI components and modify the existing Magic MCP client to communicate with this new backend. This will provide a completely private, air-gapped solution for AI-powered UI generation.

## 2. Project Goals

- **Self-Hosting:** Create a backend service that can be deployed independently on our own infrastructure.
- **Custom Component Library:** The service must serve a private, custom-defined library of UI components.
- **Client Integration:** The existing Magic MCP client will be forked and modified to connect to our new backend instead of the public 21st.dev service.
- **Maintain Core Functionality:** The final product should retain the core features of the original Magic tool: creating, refining, and fetching UI components via natural language commands in an IDE.

## 3. Key Features (Epics)

### 3.1. Backend Service Development

- **API Server:** Build a robust API server (e.g., using Node.js/Express or Python/FastAPI) to handle requests from the client.
- **Component Database:** Design and implement a database schema or file-based structure to store and manage the custom UI components.
- **AI Integration:** Integrate with the Google Gemini API to power component generation and code refinement logic. This includes developing and testing sophisticated prompts for Gemini models.
- **Search Functionality:** Implement a search endpoint (`/api/fetch-ui`) that allows for querying the custom component library.
- **Authentication:** Implement a secure authentication mechanism (e.g., API keys, OAuth) to protect the backend service.

### 3.2. Client Modification

- **Fork and Rebrand:** Fork the existing `@21st-dev/magic` repository.
- **API Retargeting:** Modify the HTTP client to point to the new self-hosted backend URL.
- **Authentication Update:** Update the client's authentication logic to match the new backend's requirements.
- **Tool Logic Adjustment:** Adjust the logic and schemas within each tool (`create-ui`, `refine-ui`, `fetch-ui`) to align with the new API's request/response structures.
- **UI Flow Rework:** Re-implement the `create-ui` flow, replacing the `21st.dev/magic-chat` web view with a custom frontend interface if necessary.

### 3.3. Component Library Curation

- **Initial Component Ingestion:** Populate the component database with an initial set of custom UI components.
- **(Placeholder for User's Component List)**
  - _This section will be populated with the specific list of components provided by the user._

## 4. Non-Goals

- This project will not replicate the `logo-search` functionality initially, as it relies on a public third-party API (`svgl.app`). This can be added later if desired.
- This project is not intended to be a multi-tenant solution. It is designed for single-organization, private use.

## 5. Success Criteria

- A developer can successfully deploy the backend service to a private server.
- A developer can install and configure the modified client in their IDE.
- A developer can issue a command like `/ui create a custom button` and receive a code snippet generated from the private component library.
- The entire system functions without making any network requests to external `21st.dev` services.
