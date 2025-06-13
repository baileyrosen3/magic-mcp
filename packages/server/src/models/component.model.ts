export interface Component {
  id: string;
  name: string;
  description: string;
  framework: "react" | "vue" | "svelte" | "html";
  tags: string[];
  code: string;
  createdAt: string;
  updatedAt: string;
}
