import { LiveProvider, LivePreview, LiveError } from "react-live";
import * as LucideIcons from "lucide-react";
import { cva } from "class-variance-authority";
import * as Accordion from "@radix-ui/react-accordion";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import * as Avatar from "@radix-ui/react-avatar";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as Collapsible from "@radix-ui/react-collapsible";
import * as ContextMenu from "@radix-ui/react-context-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as HoverCard from "@radix-ui/react-hover-card";
import * as Label from "@radix-ui/react-label";
import * as Menubar from "@radix-ui/react-menubar";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import * as Popover from "@radix-ui/react-popover";
import * as Progress from "@radix-ui/react-progress";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import * as Select from "@radix-ui/react-select";
import * as Separator from "@radix-ui/react-separator";
import * as Slider from "@radix-ui/react-slider";
import * as Slot from "@radix-ui/react-slot";
import * as Switch from "@radix-ui/react-switch";
import * as Tabs from "@radix-ui/react-tabs";
import * as Toast from "@radix-ui/react-toast";
import * as Toggle from "@radix-ui/react-toggle";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as Tooltip from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const scope = {
  ...LucideIcons,
  cva,
  cn,
  Accordion,
  AlertDialog,
  AspectRatio,
  Avatar,
  Checkbox,
  Collapsible,
  ContextMenu,
  Dialog,
  DropdownMenu,
  HoverCard,
  Label,
  Menubar,
  NavigationMenu,
  Popover,
  Progress,
  RadioGroup,
  ScrollArea,
  Select,
  Separator,
  Slider,
  Slot,
  Switch,
  Tabs,
  Toast,
  Toggle,
  ToggleGroup,
  Tooltip,
};

interface ComponentPreviewProps {
  code: string;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ code }) => {
  // 1. Remove all import statements and "use client"
  let transformedCode = code
    .replace(/import\s+.*?\s+from\s+['"].*?['"];?/g, "")
    .replace(/"use client";?/g, "");

  let componentNameToRender: string | null = null;

  // 2. Try to find the component to render, trying most specific patterns first

  // Pattern A: Find the first capitalized export in a block like `export { DropdownMenu, ... }`
  const namedExportMatch = transformedCode.match(/export\s*\{\s*([^}]+)\s*\}/);
  if (namedExportMatch) {
    const exports = namedExportMatch[1]
      .split(",")
      .map((s) => s.trim().split(" ")[0]);
    componentNameToRender =
      exports.find((e) => e.charAt(0) === e.charAt(0).toUpperCase()) || null;
  }

  // Pattern B: Fallback to `export const Component = ...`
  if (!componentNameToRender) {
    const constExportMatch = transformedCode.match(
      /export\s+const\s+([A-Z]\w*)/
    );
    if (constExportMatch) {
      componentNameToRender = constExportMatch[1];
    }
  }

  // Pattern C: Fallback to `export default function Component() ...`
  if (!componentNameToRender) {
    const defaultExportMatch = transformedCode.match(
      /export\s+default\s+function\s+([A-Z]\w*)/
    );
    if (defaultExportMatch) {
      componentNameToRender = defaultExportMatch[1];
    }
  }

  // 3. If a component was found, append the render call. Otherwise, do nothing.
  if (componentNameToRender) {
    transformedCode = transformedCode
      .replace(/export\s*{[^}]+};?/, "") // remove named export block
      .replace(/export\s+default\s+\w+;?/, ""); // remove default export
    transformedCode += `\nrender(<${componentNameToRender} />);`;
  } else {
    // If we can't find a component, render nothing to avoid the error.
    // The LiveError component below will show our message.
    transformedCode = "render(<>Preview not available</>)";
  }

  return (
    <LiveProvider code={transformedCode} scope={scope} noInline={true}>
      <LivePreview className="w-full h-full flex items-center justify-center p-4" />
      <LiveError className="text-destructive text-xs p-2 absolute bottom-0 left-0 right-0 bg-background" />
    </LiveProvider>
  );
};

export default ComponentPreview;
