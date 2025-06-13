import fs from "fs/promises";
import path from "path";
import { Component } from "../models/component.model";
import { v4 as uuidv4 } from "uuid";
import * as aiService from "./ai.service";

const dbPath = path.join(__dirname, "../../db");

export const fetchAllComponents = async (): Promise<Component[]> => {
  try {
    const files = await fs.readdir(dbPath);
    const componentPromises = files
      .filter((file) => file.endsWith(".json"))
      .map(async (file) => {
        const filePath = path.join(dbPath, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        return JSON.parse(fileContent) as Component;
      });
    return Promise.all(componentPromises);
  } catch (error) {
    console.error("Error fetching components:", error);
    return [];
  }
};

export const fetchComponentById = async (
  id: string
): Promise<Component | null> => {
  try {
    const files = await fs.readdir(dbPath);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(dbPath, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const component = JSON.parse(fileContent) as Component;
        if (component.id === id) {
          return component;
        }
      }
    }
    return null; // Component not found
  } catch (error) {
    console.error(`Error fetching component with id ${id}:`, error);
    return null;
  }
};

export const updateComponent = async (
  id: string,
  updatedData: Partial<Component>
): Promise<Component | null> => {
  try {
    const files = await fs.readdir(dbPath);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const filePath = path.join(dbPath, file);
        const fileContent = await fs.readFile(filePath, "utf-8");
        const component = JSON.parse(fileContent) as Component;

        if (component.id === id) {
          const newComponentData = {
            ...component,
            ...updatedData,
            updatedAt: new Date().toISOString(),
          };
          await fs.writeFile(
            filePath,
            JSON.stringify(newComponentData, null, 2),
            "utf-8"
          );
          return newComponentData;
        }
      }
    }
    return null; // Component not found
  } catch (error) {
    console.error(`Error updating component with id ${id}:`, error);
    return null;
  }
};

export const saveComponent = async (
  componentData: Omit<Component, "id" | "createdAt" | "updatedAt">
): Promise<Component> => {
  const newComponent: Component = {
    ...componentData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const filename = `${newComponent.name
    .toLowerCase()
    .replace(/\s+/g, "-")}.json`;
  const filePath = path.join(dbPath, filename);

  await fs.writeFile(filePath, JSON.stringify(newComponent, null, 2), "utf-8");

  return newComponent;
};

export const refineComponent = async (
  id: string,
  prompt: string
): Promise<Component | null> => {
  const componentToRefine = await fetchComponentById(id);
  if (!componentToRefine) {
    return null;
  }

  const refinedCode = await aiService.refineComponent(
    componentToRefine.code,
    prompt
  );
  if (!refinedCode) {
    // Failed to get a refinement from the AI service
    return null;
  }

  const updatedComponent = await updateComponent(id, {
    code: refinedCode,
    description: prompt,
  });
  return updatedComponent;
};
