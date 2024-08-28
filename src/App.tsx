import { useState } from "react";

import reactLogo from "@/assets/react.svg";
import { Button } from "@/components/ui/button";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="grid min-h-svh place-content-center gap-1">
      <div className="flex items-center justify-center gap-2">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="size-32" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="size-32" alt="React logo" />
        </a>
      </div>
      <h1 className="text-center text-5xl">Vite + React</h1>
      <div className="my-4 grid place-content-center gap-2">
        <Button
          onClick={() => {
            setCount((count) => count + 1);
          }}
        >
          count is {count}
        </Button>
        <p>
          Edit{" "}
          <code className="inline-block rounded bg-gray-100 px-1 py-1 font-mono text-sm text-red-400">
            src/App.tsx
          </code>{" "}
          and save to test HMR
        </p>
      </div>
      <p className="text-center text-xs">Click on the Vite and React logos to learn more</p>
    </div>
  );
}

export default App;
