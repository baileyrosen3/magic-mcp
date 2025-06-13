import React, { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export const DEFAULT_PROPS: Record<string, any> = {
  "3dmarquee": {
    images: [
      "https://picsum.photos/id/237/970/700",
      "https://picsum.photos/id/238/970/700",
      "https://picsum.photos/id/239/970/700",
      "https://picsum.photos/id/240/970/700",
      "https://picsum.photos/id/241/970/700",
      "https://picsum.photos/id/242/970/700",
      "https://picsum.photos/id/243/970/700",
      "https://picsum.photos/id/244/970/700",
    ],
  },
  accordion: {
    type: "single",
    collapsible: true,
    children: null, // We'll handle this in a special way
  },
  "word-rotate": {
    words: ["Magic UI", "for", "React"],
  },
  "video-text": {
    src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    children: "Video Text",
  },
  "warp-background": {
    children: React.createElement(
      "div",
      { className: "text-white" },
      "Warp Background"
    ),
  },
  "text-reveal": {
    children: "Hello world this is Magic UI",
  },
  "typing-animation": {
    children: "Magic UI is awesome",
  },
  terminal: {
    children: React.createElement("span", null, "npm install magic-ui"),
  },
  "text-animate": {
    children: "Magic UI animated text",
  },
  "shiny-button": {
    children: "Click me",
  },
  "sparkles-text": {
    children: "Magic UI",
  },
  "spinning-text": {
    children: "Magic UI",
  },
  "shimmer-button": {
    children: "Shimmer",
  },
  "shine-border": {},
  "script-copy-btn": {
    codeLanguage: "bash",
    lightTheme: "light-plus",
    darkTheme: "dark-plus",
    commandMap: {
      npm: "npm install magic-ui",
      yarn: "yarn add magic-ui",
      pnpm: "pnpm add magic-ui",
    },
  },
  "scroll-based-velocity": {
    children: "Magic UI scroll velocity",
  },
  safari: {
    url: "https://magicui.dev",
  },
  "scratch-to-reveal": {
    width: 300,
    height: 200,
    children: React.createElement(
      "div",
      {
        className:
          "flex items-center justify-center h-full bg-white text-black",
      },
      "Scratch me!"
    ),
  },
  "ripple-button": {
    children: "Ripple",
  },
  "pulsating-button": {
    children: "Pulse",
  },
  "rainbow-button": {
    children: "Rainbow",
  },
  "number-ticker": {
    value: 1000,
  },
  "orbiting-circles": {
    children: React.createElement("div", {
      className: "size-full bg-primary rounded-full",
    }),
  },
  "morphing-text": {
    texts: ["Magic", "UI", "Rocks"],
  },
  marquee: {
    children: React.createElement("span", null, "Magic UI Marquee"),
  },
  lens: {
    children: React.createElement("img", {
      src: "https://picsum.photos/id/1005/600/400",
      className: "w-full h-full object-cover",
    }),
  },
  "line-shadow-text": {
    children: "Magic UI",
  },
  "hyper-text": {
    children: "Magic UI",
  },
  "icon-cloud": {
    images: [
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    ],
  },
  "hero-video-dialog": {
    videoSrc: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailSrc: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  },
  "file-tree": {
    elements: [
      {
        id: "root",
        name: "src",
        children: [
          { id: "comp", name: "components", children: [] },
          { id: "app", name: "App.tsx", isSelectable: true },
        ],
      },
    ],
  },
  "code-comparison": {
    beforeCode: "const a = 1;\nconsole.log(a);",
    afterCode: "const a = 42;\nconsole.log(a);",
    language: "typescript",
    filename: "example.ts",
    lightTheme: "github-light",
    darkTheme: "github-dark",
  },
  "wobble-card": {
    children: React.createElement(
      "div",
      { className: "text-white p-8" },
      "Wobble Card"
    ),
  },
  "world-map": {
    dots: [
      {
        start: { lat: 37.7749, lng: -122.4194 },
        end: { lat: 40.7128, lng: -74.006 },
      },
    ],
  },
  "youtube-player": {
    videoId: "dQw4w9WgXcQ",
    title: "Magic UI Demo",
  },
  typewriter: {
    delay: 0.5,
    baseText: "Magic UI",
    texts: ["rocks!", "is awesome!", "makes dev easy!"],
  },
  "typewriter-effect": {
    words: [{ text: "Magic" }, { text: "UI" }, { text: "rocks" }],
  },
  tiltcard: {
    children: React.createElement(
      "div",
      {
        className: "flex items-center justify-center h-full text-xl font-bold",
      },
      "3D Card"
    ),
  },
  // Kibo-UI Avatar Stack demo – show 3 sample avatars
  avatarstack: {
    size: 40,
    animate: true,
    children: React.createElement(
      React.Fragment,
      null,
      React.createElement(
        Avatar,
        null,
        React.createElement(AvatarImage, {
          src: "https://i.pravatar.cc/40?img=1",
          alt: "",
        }),
        React.createElement(AvatarFallback, null, "JD")
      ),
      React.createElement(
        Avatar,
        null,
        React.createElement(AvatarImage, {
          src: "https://i.pravatar.cc/40?img=2",
          alt: "",
        }),
        React.createElement(AvatarFallback, null, "MS")
      ),
      React.createElement(
        Avatar,
        null,
        React.createElement(AvatarImage, {
          src: "https://i.pravatar.cc/40?img=3",
          alt: "",
        }),
        React.createElement(AvatarFallback, null, "AL")
      )
    ),
  },
};

// Special component renderers for components that need composition
export const SPECIAL_COMPONENT_RENDERERS: Record<
  string,
  (modules: any) => React.ReactElement
> = {
  accordion: (modules) => {
    const AccordionDemo = () => {
      const [accordionComponents, setAccordionComponents] = useState<any>(null);

      useEffect(() => {
        let key = Object.keys(modules).find((k) =>
          k.endsWith("/ui/accordion.tsx")
        );
        if (!key) return;
        (modules[key] as any)().then((module: any) => {
          setAccordionComponents(module);
        });
      }, []);

      if (!accordionComponents)
        return React.createElement("div", {}, "Loading accordion...");

      const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } =
        accordionComponents;

      return React.createElement(
        "div",
        { className: "w-full max-w-md mx-auto" },
        React.createElement(
          Accordion,
          { type: "single", collapsible: true, className: "w-full" },
          React.createElement(
            AccordionItem,
            { value: "item-1" },
            React.createElement(AccordionTrigger, {}, "Is it accessible?"),
            React.createElement(
              AccordionContent,
              {},
              "Yes. It adheres to the WAI-ARIA design pattern."
            )
          ),
          React.createElement(
            AccordionItem,
            { value: "item-2" },
            React.createElement(AccordionTrigger, {}, "Is it styled?"),
            React.createElement(
              AccordionContent,
              {},
              "Yes. It comes with default styles that match the other components."
            )
          ),
          React.createElement(
            AccordionItem,
            { value: "item-3" },
            React.createElement(AccordionTrigger, {}, "Is it animated?"),
            React.createElement(
              AccordionContent,
              {},
              "Yes. It's animated by default, but you can disable it if you prefer."
            )
          )
        )
      );
    };

    return React.createElement(AccordionDemo);
  },
  branch: (modules) => {
    return React.createElement(() => {
      const [branchModule, setBranchModule] = useState<any>(null);
      useEffect(() => {
        const key = Object.keys(modules).find((k) =>
          k.endsWith("/ui/kibo-ui/ai/branch.tsx")
        );
        if (!key) return;
        (modules[key] as any)().then((mod: any) => {
          setBranchModule(mod);
        });
      }, []);
      if (!branchModule) return React.createElement("div", {}, "Loading...");
      const {
        AIBranch,
        AIBranchMessages,
        AIBranchSelector,
        AIBranchPrevious,
        AIBranchNext,
      } = branchModule;
      return React.createElement(
        AIBranch,
        { className: "max-w-md mx-auto" },
        React.createElement(
          AIBranchMessages,
          null,
          React.createElement("div", {}, "Hello, how can I help you?"),
          React.createElement("div", {}, "Here is an alternative answer!")
        ),
        React.createElement(
          AIBranchSelector,
          { from: "assistant", className: "mt-2 flex gap-2" },
          React.createElement(AIBranchPrevious, null),
          React.createElement(AIBranchNext, null)
        )
      );
    });
  },
};
