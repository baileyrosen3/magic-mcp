import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import util from "util";

const execAsync = util.promisify(exec);

// Helper function to recursively find all files in a directory
const getFilesInDir = async (dir: string): Promise<string[]> => {
  let files: string[] = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(await getFilesInDir(fullPath));
      } else {
        files.push(fullPath);
      }
    }
  } catch (error) {
    // If the directory doesn't exist, return an empty array.
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }
    throw error;
  }
  return files;
};

// Helper function to run a command and stream its output
const runCommandWithLogs = (command: string, cwd: string): Promise<void> => {
  return new Promise((resolve) => {
    console.log(`\n> Running command in ${cwd}:\n  ${command}\n`);
    const child = exec(command, { cwd });

    child.stdout?.on("data", (data) => {
      process.stdout.write(data);
    });

    child.stderr?.on("data", (data) => {
      process.stderr.write(data);
    });

    child.on("close", (code) => {
      if (code === 0) {
        console.log(`\n> Command finished successfully.\n`);
      } else {
        console.error(`\n> Command exited with code ${code}. Continuing...\n`);
      }
      // Always resolve to allow the script to continue
      resolve();
    });

    child.on("error", (err) => {
      console.error(`\n> Failed to start command: ${command}\n`, err);
      // Don't reject, just resolve
      resolve();
    });
  });
};

// Define the structure for our server's DB
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

// Define the structure of the input catalog
interface CatalogComponent {
  name: string;
  description: string;
  keywords: string[];
  installCommand: string;
  library: string;
}

// Function to generate a URL-friendly ID
const generateId = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
};

const initializeShadcn = async (clientPath: string) => {
  const componentsJsonPath = path.join(clientPath, "components.json");
  try {
    // Check if the file exists
    await fs.access(componentsJsonPath);
    console.log("shadcn-ui is already initialized (components.json exists).");
  } catch {
    // If it doesn't exist, create it
    console.log("components.json not found. Creating it now...");
    const config = {
      $schema: "https://ui.shadcn.com/schema.json",
      style: "default",
      rsc: true,
      tsx: true,
      tailwind: {
        config: "tailwind.config.ts",
        css: "src/app/globals.css",
        baseColor: "slate",
        cssVariables: true,
      },
      aliases: {
        components: "@/components",
        utils: "@/utils",
      },
    };
    await fs.writeFile(componentsJsonPath, JSON.stringify(config, null, 2));
    console.log("Created valid components.json.");
  }
};

const main = async () => {
  // Script is run from packages/server, so go up two directories to get to project root
  const projectRoot = path.join(process.cwd(), "..", "..");
  const clientPath = path.join(projectRoot, "packages", "client");
  const clientComponentsPath = path.join(clientPath, "src", "components");
  const serverDbPath = path.join(process.cwd(), "db");
  const catalogPath = path.join(process.cwd(), "catalog.json");

  console.log("Starting component import process...");
  console.log(`Looking for catalog at: ${catalogPath}`);

  // 0. Initialize shadcn-ui in the client if not already done
  await initializeShadcn(clientPath);

  // 1. Read the catalog file
  const catalogContent = await fs.readFile(catalogPath, "utf-8");
  const catalog = JSON.parse(catalogContent);
  const componentsToInstall: CatalogComponent[] = catalog.components;

  console.log(`Found ${componentsToInstall.length} components to install.`);

  await fs.mkdir(clientComponentsPath, { recursive: true });

  for (const component of componentsToInstall) {
    console.log(`--- Processing: ${component.name} ---`);

    const filesBefore = new Map<string, Date>();
    try {
      const existingFiles = await getFilesInDir(clientComponentsPath);
      for (const file of existingFiles) {
        const stats = await fs.stat(file);
        filesBefore.set(file, stats.mtime);
      }
    } catch (error) {
      // Ignore if the directory doesn't exist yet
    }

    const installCommand = `${component.installCommand} --overwrite`;

    try {
      await runCommandWithLogs(installCommand, clientPath);

      const filesAfter = await getFilesInDir(clientComponentsPath);
      const changedFiles = [];

      for (const file of filesAfter) {
        const oldMtime = filesBefore.get(file);
        const newMtime = (await fs.stat(file)).mtime;
        if (!oldMtime || newMtime > oldMtime) {
          changedFiles.push(file);
        }
      }

      if (changedFiles.length === 0) {
        console.error(
          `  No new or updated component files found for ${component.name}. Skipping.`
        );
        continue;
      }

      console.log(`  Found ${changedFiles.length} new or updated file(s):`);
      changedFiles.forEach((file) =>
        console.log(`    - ${path.basename(file)}`)
      );

      let combinedCode = "";
      for (const newFilePath of changedFiles) {
        const componentCode = await fs.readFile(newFilePath, "utf-8");
        const relativePath = path.relative(clientComponentsPath, newFilePath);
        combinedCode += `// Path: ${relativePath}\n\n${componentCode}\n\n`;
      }

      const newDbEntry: Component = {
        id: generateId(component.name),
        name: component.name,
        description: component.description,
        framework: "react",
        library: component.library,
        tags: component.keywords,
        code: combinedCode.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const dbFileName = `${newDbEntry.id}.json`;
      const dbFilePath = path.join(serverDbPath, dbFileName);
      await fs.writeFile(
        dbFilePath,
        JSON.stringify(newDbEntry, null, 2),
        "utf-8"
      );
      console.log(`  Saved component to ${dbFilePath}`);

      // We are keeping the files for manual inspection for now
      // for (const newFilePath of newFiles) {
      //   await fs.unlink(newFilePath);
      //   console.log(`  Cleaned up ${newFilePath}`);
      // }
    } catch (error) {
      console.error(`  Failed to process ${component.name}:`, error);
    }
    console.log(`--- Finished: ${component.name} ---\n`);
  }

  console.log("Finished importing all components.");
};

main().catch(console.error);
