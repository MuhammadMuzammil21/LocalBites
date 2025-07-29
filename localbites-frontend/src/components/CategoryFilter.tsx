// src/components/CategoryFilter.tsx

import { Button } from "../components/ui/button";
import { useState } from "react";

const categories = ["All", "Pizza", "Desi", "Burgers", "Chinese", "Dessert"];

interface Props {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-2 flex-wrap justify-center py-6">
      {categories.map((cat) => (
        <Button
          key={cat}
          variant={selected === cat ? "default" : "outline"}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}
