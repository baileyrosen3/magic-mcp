# Magic MCP Server Documentation

This document provides a detailed explanation of each file in the Magic MCP Server codebase.

## Root Directory

### `Dockerfile`

This file defines the Docker container for the application. It uses a Node.js base image, sets up the working directory, installs dependencies using `npm`, copies the application code, builds the TypeScript source, and sets the default command to run the application.

### `jest.config.js`

This is the configuration file for Jest, the testing framework used in this project. It's set up to work with TypeScript and ES modules, defining the preset, test environment, and how to transform TypeScript files for testing.

### `llms-install.md`

This markdown file is an installation guide specifically for AI agents like Cline to install and configure the Magic MCP server. It includes prerequisites, configuration steps for different clients (Windsurf, Cline), and verification instructions.

### `package.json`

This file is the heart of the Node.js project. It defines project metadata (name, version, description), scripts for building, running, testing, and publishing the application, and lists all the production and development dependencies.

### `README.md`

The main documentation for the project. It provides a comprehensive overview of the Magic AI Agent, its features, how it works, installation instructions for various IDEs (Cursor, Windsurf, VSCode), a FAQ section, and contribution guidelines.

### `smithery.yaml`

This is a configuration file for Smithery, a tool related to the Model Context Protocol (MCP). It defines how to start the MCP server, including the command and required configuration properties like the `TWENTY_FIRST_API_KEY`.

### `tsconfig.json`

This file configures the TypeScript compiler (`tsc`). It specifies compiler options like the target ECMAScript version, module system, output directory, and which files to include and exclude from compilation.

## `src` Directory

### `src/index.ts`

This is the main entry point of the application. It initializes the `McpServer`, registers all the available tools (`CreateUiTool`, `LogoSearchTool`, `FetchUiTool`, `RefineUiTool`), and starts the server using a `StdioServerTransport`. It also handles graceful shutdown on signals like `SIGTERM` and `SIGINT`.

## `src/tools` Directory

This directory contains the definitions for the tools that the MCP server exposes to the AI agent.

### `src/tools/create-ui.ts`

This tool is used to create new UI components. It takes a user's message, generates a search query for the 21st.dev UI library, and formulates a request to the service. It then opens a browser window to `21st.dev/magic-chat` where the user can interact to create a component. A local callback server waits for the response, which contains the generated code snippet and instructions for integrating it, including how to install any necessary `shadcn/ui` dependencies.

### `src/tools/fetch-ui.ts`

This tool is for getting inspiration or fetching data about existing UI components from 21st.dev. It takes a user's message and a search query and makes a POST request to the `/api/fetch-ui` endpoint to retrieve component data as JSON.

### `src/tools/logo-search.ts`

This tool searches for company logos using the `svgl.app` API. It can fetch multiple logos at once and return them in various formats (JSX, TSX, SVG). It also includes logic to convert SVG content into React components. The tool provides structured output with the component code and instructions on how to import and use the logos.

### `src/tools/refine-ui.ts`

This tool is used to improve or redesign existing UI components. It takes the user's message, the path to the file to be refined, and a description of the desired changes. It sends this information, along with the file's content, to the `/api/refine-ui` endpoint and returns the redesigned component code.

## `src/utils` Directory

This directory contains utility modules used across the application.

### `src/utils/base-tool.ts`

This file defines an abstract `BaseTool` class that all other tools inherit from. It enforces a common structure for tools, requiring `name`, `description`, `schema` (for input validation using Zod), and an `execute` method. It also provides a `register` method to easily add the tool to the `McpServer`.

### `src/utils/callback-server.ts`

This utility implements a simple HTTP server to handle callbacks. This is used by the `CreateUiTool` to receive the generated UI component from the `21st.dev` web interface. It finds an available port, starts a server, and waits for a single POST request before shutting down.

### `src/utils/config.ts`

This module is responsible for parsing configuration from command-line arguments. It specifically looks for an `API_KEY` to be used for authenticating with the 21st.dev API.

### `src/utils/console.ts`

This module overrides the global `console.log` and `console.error` functions. It formats log messages as JSON-RPC notifications, which is a format expected by some IDEs like Cursor for displaying log messages and errors in the UI.

### `src/utils/get-content-of-file.ts`

A simple utility function that reads the content of a file at a given path using Node.js's `fs/promises` module. It's used by tools that need to read local files.

### `src/utils/http-client.test.ts`

This file contains a simple test for the `http-client`, ensuring that it correctly points to the production URL when not in debug mode.

### `src/utils/http-client.ts`

This module provides a typed HTTP client for making requests to the 21st.dev API (`https://magic.21st.dev`). It's a wrapper around `fetch` that automatically includes the API key in the headers and sets the correct `Content-Type`. It supports different HTTP methods (GET, POST, PUT, DELETE, PATCH). It can also be configured to point to a local development server.
