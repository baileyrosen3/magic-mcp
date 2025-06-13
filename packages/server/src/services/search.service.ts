import fs from "fs/promises";
import path from "path";

interface Component {
  id: string;
  name: string;
  description: string;
  framework: "react";
  library: string;
  tags: string[];
  code: string;
  createdAt: string;
  updatedAt: string;
}

const dbPath = path.join(process.cwd(), "db");

const readAllComponents = async (): Promise<Component[]> => {
  const files = await fs.readdir(dbPath);
  const componentPromises = files
    .filter((file) => file.endsWith(".json"))
    .map(async (file) => {
      const filePath = path.join(dbPath, file);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content) as Component;
    });
  return Promise.all(componentPromises);
};

export const searchComponents = async (query: {
  term?: string;
  tags?: string[];
  libraries?: string[];
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
}): Promise<{
  data: Component[];
  pagination: { total: number; page: number; limit: number };
}> => {
  let components = await readAllComponents();

  // Filter by search term
  if (query.term) {
    const searchTerm = query.term.toLowerCase();
    components = components.filter((c) => {
      const nameMatch = c.name && c.name.toLowerCase().includes(searchTerm);
      const descriptionMatch =
        c.description && c.description.toLowerCase().includes(searchTerm);
      const tagMatch =
        c.tags && c.tags.some((t) => t.toLowerCase().includes(searchTerm));
      const libraryMatch =
        c.library && c.library.toLowerCase().includes(searchTerm);
      return nameMatch || descriptionMatch || tagMatch || libraryMatch;
    });
  }

  // Filter by tags
  if (query.tags && query.tags.length > 0) {
    const tags = query.tags.map((t) => t.toLowerCase());
    components = components.filter((c) =>
      c.tags.some((tag) => tags.includes(tag.toLowerCase()))
    );
  }

  // Filter by libraries
  if (query.libraries && query.libraries.length > 0) {
    const libraries = query.libraries.map((l) => l.toLowerCase());
    components = components.filter((c) =>
      libraries.includes(c.library.toLowerCase())
    );
  }

  // Sort
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  components.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate
  const page = query.page || 1;
  const limit = query.limit || 10;
  const total = components.length;
  const paginatedData = components.slice((page - 1) * limit, page * limit);

  return {
    data: paginatedData,
    pagination: { total, page, limit },
  };
};
