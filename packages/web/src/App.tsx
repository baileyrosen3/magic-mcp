import { Suspense, lazy, useEffect, useState } from "react";
import { fetchComponents } from "./services/componentService";
import { Component } from "./types/component";
import "./App.css";
import React from "react";
import { Button } from "./components/ui/button";
import {
  DEFAULT_PROPS,
  SPECIAL_COMPONENT_RENDERERS,
} from "./componentDefaults";
import { Input } from "./components/ui/input";
import { cn } from "./utils";
import { ScrollArea } from "./components/ui/scroll-area";

const modules = import.meta.glob("/src/components/**/*.tsx");

const normalizeName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.tsx$/, "")
    .replace(/[^a-z0-9]/g, "");

const componentMap = Object.keys(modules).reduce((acc, path) => {
  if (path.includes("ComponentPreview.tsx") || path.includes("layout.tsx")) {
    return acc;
  }
  // Determine the key for this module.
  // If the file itself is `index.tsx` we treat the *folder* name as the component key
  // so that paths like `ui/kibo-ui/avatar-stack/index.tsx` register as `avatarstack`.
  const pathSegments = path.split("/");
  const fileName = pathSegments.pop() || "";
  const keySource =
    fileName === "index.tsx" ? pathSegments.pop() || fileName : fileName;

  const normalized = normalizeName(keySource);

  acc[normalized] = lazy(() =>
    (modules[path] as () => Promise<any>)().then((module) => {
      // Assume the first export from the file is the component to render.
      const componentName = Object.keys(module)[0];
      if (componentName) {
        return { default: module[componentName] };
      }
      // Fallback if a module has no exports.
      return {
        default: () => (
          <div>Component could not be loaded: No exports found.</div>
        ),
      };
    })
  );
  return acc;
}, {} as Record<string, React.ComponentType<any>>);

const nameAlias: Record<string, string> = {
  "3dcardeffect": "tiltcard",
  aibranch: "branch",
};

function App() {
  const [components, setComponents] = useState<Component[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(
    null
  );
  const [search, setSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = React.useMemo(() => {
    const catCount: Record<string, number> = {};
    components.forEach((comp) => {
      comp.tags.forEach((tag) => {
        catCount[tag] = (catCount[tag] || 0) + 1;
      });
    });
    return catCount;
  }, [components]);

  const filteredComponents = React.useMemo(() => {
    return components.filter((c) => {
      const inCategory =
        selectedCategory === "All" || c.tags.includes(selectedCategory);
      const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
      return inCategory && matchesSearch;
    });
  }, [components, search, selectedCategory]);

  useEffect(() => {
    const getComponents = async () => {
      try {
        const comps = await fetchComponents();
        setComponents(comps);
      } catch (error) {
        console.error("Failed to fetch components", error);
      }
    };
    getComponents();
  }, []);

  const handleComponentClick = (component: Component) => {
    setSelectedComponent(component);
  };

  const closeModal = () => {
    setSelectedComponent(null);
  };

  const renderSelectedComponent = () => {
    if (!selectedComponent) return null;

    let normalizedSelectedName = normalizeName(selectedComponent.name);
    if (nameAlias[normalizedSelectedName]) {
      normalizedSelectedName = nameAlias[normalizedSelectedName];
    }
    const LoadedComponent = componentMap[normalizedSelectedName];
    const props = DEFAULT_PROPS[normalizedSelectedName] || {};

    if (LoadedComponent) {
      return (
        <Suspense fallback={<div>Loading...</div>}>
          <LoadedComponent {...props} />
        </Suspense>
      );
    }

    return (
      <div className="text-red-500">
        Component "{selectedComponent.name}" not found locally.
      </div>
    );
  };

  const renderComponent = () => {
    if (
      selectedComponent &&
      selectedComponent.name.toLowerCase() in SPECIAL_COMPONENT_RENDERERS
    ) {
      return SPECIAL_COMPONENT_RENDERERS[selectedComponent.name.toLowerCase()](
        modules
      );
    }
    return renderSelectedComponent();
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden md:flex h-full w-64 flex-col border-r border-border bg-secondary-background">
        <header className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Categories</h2>
        </header>
        <ScrollArea className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            <li>
              <button
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent",
                  selectedCategory === "All" &&
                    "bg-accent text-accent-foreground"
                )}
                onClick={() => setSelectedCategory("All")}
              >
                <span>All</span>
                <span className="text-xs opacity-70">{components.length}</span>
              </button>
            </li>
            {Object.entries(categories).map(([cat, count]) => (
              <li key={cat}>
                <button
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm capitalize hover:bg-accent",
                    selectedCategory === cat &&
                      "bg-accent text-accent-foreground"
                  )}
                  onClick={() => setSelectedCategory(cat)}
                >
                  <span>{cat}</span>
                  <span className="text-xs opacity-70">{count}</span>
                </button>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b border-border bg-secondary-background flex items-center gap-4">
          <h1 className="text-xl font-bold hidden sm:block">
            Component Library
          </h1>
          <Input
            placeholder="Search components... (⌘/Ctrl + K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredComponents.map((component) => (
              <div
                key={component.id}
                className="rounded-lg border border-border bg-secondary-background p-4 cursor-pointer transition hover:border-primary hover:shadow-md"
                onClick={() => handleComponentClick(component)}
              >
                <h3
                  className="font-medium mb-1 truncate"
                  title={component.name}
                >
                  {component.name}
                </h3>
                <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis whitespace-nowrap min-h-[2rem]">
                  {component.description}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Modal */}
      {selectedComponent && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-background rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-3/5 h-5/6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-border flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedComponent.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedComponent.library}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center">
              <Suspense fallback={<div>Loading component...</div>}>
                {renderComponent()}
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
