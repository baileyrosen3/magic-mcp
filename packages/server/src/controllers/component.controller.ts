import { Request, Response } from "express";
import * as componentService from "../services/component.service";
import * as aiService from "../services/ai.service";

export const getComponents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const components = await componentService.fetchAllComponents();
    res.status(200).json(components);
  } catch (error) {
    res.status(500).json({ message: "Error fetching components", error });
  }
};

export const createComponent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      res.status(400).json({ message: "Prompt is required" });
      return;
    }

    const componentCode = await aiService.generateComponent(prompt);
    if (!componentCode) {
      res.status(500).json({ message: "Failed to generate component" });
      return;
    }

    // A simple way to extract a name from the prompt
    const name = prompt.toLowerCase().includes("button")
      ? "Generated Button"
      : "Generated Component";

    const newComponent = await componentService.saveComponent({
      name: name,
      description: prompt,
      framework: "react",
      tags: ["generated"],
      code: componentCode,
    });

    res.status(201).json(newComponent);
  } catch (error) {
    res.status(500).json({ message: "Error creating component", error });
  }
};

export const refineComponent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ message: "Prompt is required for refinement" });
      return;
    }

    const refinedComponent = await componentService.refineComponent(id, prompt);

    if (!refinedComponent) {
      res
        .status(404)
        .json({ message: "Component not found or refinement failed" });
      return;
    }

    res.status(200).json(refinedComponent);
  } catch (error) {
    res.status(500).json({ message: "Error refining component", error });
  }
};
