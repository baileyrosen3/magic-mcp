import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="w-64 p-4">
        <h1 className="text-2xl font-bold">UI Components</h1>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default Layout;
