import { RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const calculateLocalStorageCapacity = () => {
  const key = "test";
  let testValue = "x";
  let totalSize = 0;

  try {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    while (true) {
      localStorage.setItem(key, testValue);
      totalSize += testValue.length;
      testValue = testValue + testValue;
    }
  } catch (e) {
    console.error("Error calculating localStorage capacity:", e);
    while (testValue.length > 0) {
      try {
        testValue = testValue.slice(0, testValue.length / 2);
        localStorage.setItem(key, testValue);
        totalSize += testValue.length;
      } catch (e) {
        console.error("Error calculating localStorage capacity:", e);
        continue;
      }
    }
  }

  localStorage.removeItem(key);
  return totalSize;
};

export function Component() {
  const [usage, setUsage] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [items, setItems] = useState<{ key: string; size: number }[]>([]);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [browserSizes, setBrowserSizes] = useState<Record<string, number>>({});

  const updateCapacity = useCallback(() => {
    setIsCalculating(true);
    try {
      setTimeout(() => {
        const calculatedCapacity = calculateLocalStorageCapacity();
        setCapacity(calculatedCapacity);
        setIsCalculating(false);

        // Simulating API fetch for browser sizes
        // In a real scenario, replace this with an actual API call
        setBrowserSizes({
          Chrome: calculatedCapacity,
          Firefox: Math.round(calculatedCapacity * 0.9),
          Safari: Math.round(calculatedCapacity * 0.95),
          Edge: Math.round(calculatedCapacity * 1.0),
        });
      }, 0);
    } catch (error) {
      console.error("Error calculating localStorage capacity:", error);
      setIsCalculating(false);
    }
  }, []);

  useEffect(() => {
    updateUsage();
    updateCapacity();
  }, [updateCapacity]);

  const updateUsage = () => {
    let total = 0;
    const newItems = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        const size = new Blob([value ?? ""]).size;
        total += size;
        newItems.push({ key, size });
      }
    }
    setUsage(total);
    setItems(newItems);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKey && newValue) {
      localStorage.setItem(newKey, newValue);
      setNewKey("");
      setNewValue("");
      updateUsage();
    }
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
    updateUsage();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes.toString() + " bytes";
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const usagePercentage = capacity > 0 ? (usage / capacity) * 100 : 0;

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-center text-2xl font-bold">localStorage Size Calculator</h1>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span>Usage:</span>
          <span>
            {formatSize(usage)} / {formatSize(capacity)}
          </span>
          <Button onClick={updateCapacity} disabled={isCalculating} size="sm" variant="outline">
            {isCalculating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Progress value={usagePercentage} className="w-full" />
      </div>
      <form onSubmit={addItem} className="space-y-2">
        <Input
          type="text"
          placeholder="Key"
          value={newKey}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setNewKey(e.target.value);
          }}
        />
        <Input
          type="text"
          placeholder="Value"
          value={newValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setNewValue(e.target.value);
          }}
        />
        <Button type="submit" className="w-full">
          Add Item
        </Button>
      </form>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Stored Items:</h2>
        {items.map((item) => (
          <div
            key={item.key}
            className="bg-secondary flex items-center justify-between rounded p-2"
          >
            <span>
              {item.key} ({formatSize(item.size)})
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                removeItem(item.key);
              }}
              aria-label={`Remove ${item.key}`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Browser Comparison:</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Browser</TableHead>
              <TableHead>Estimated Capacity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(browserSizes).map(([browser, size]) => (
              <TableRow key={browser}>
                <TableCell>{browser}</TableCell>
                <TableCell>{formatSize(size)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
