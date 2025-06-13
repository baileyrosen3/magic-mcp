import { Request, Response } from "express";
import * as searchService from "../services/search.service";

export const search = async (req: Request, res: Response) => {
  try {
    const { term, tags, libraries, page, limit, sortBy, sortOrder } = req.query;

    const results = await searchService.searchComponents({
      term: term as string | undefined,
      tags: tags ? (tags as string).split(",") : undefined,
      libraries: libraries ? (libraries as string).split(",") : undefined,
      page: page ? parseInt(page as string, 10) : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
      sortBy: sortBy as "createdAt" | "name" | undefined,
      sortOrder: sortOrder as "asc" | "desc" | undefined,
    });

    res.status(200).json(results);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    res
      .status(500)
      .json({ message: "Error searching components", error: message });
  }
};
