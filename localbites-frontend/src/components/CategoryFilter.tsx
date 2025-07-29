// src/components/CategoryFilter.tsx

import { useState } from "react";
import { 
  Utensils, 
  Pizza, 
  ChefHat, 
  Sandwich, 
  Soup, 
  Cake,
  Coffee,
  IceCream
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

const categories: Category[] = [
  { id: "all", name: "All", icon: Utensils },
  { id: "pizza", name: "Pizza", icon: Pizza },
  { id: "desi", name: "Desi", icon: ChefHat },
  { id: "burgers", name: "Burgers", icon: Sandwich },
  { id: "chinese", name: "Chinese", icon: Soup },
  { id: "dessert", name: "Dessert", icon: Cake },
  { id: "cafe", name: "Cafe", icon: Coffee },
  { id: "ice-cream", name: "Ice Cream", icon: IceCream }
];

interface Props {
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex gap-4 flex-wrap justify-center py-8 px-4">
      {categories.map((category) => {
        const IconComponent = category.icon;
        const isSelected = selected === category.id;
        
        return (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`
              group relative flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300 ease-in-out
              ${isSelected 
                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 scale-105' 
                : 'bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg'
              }
              min-w-[80px] min-h-[80px]
            `}
          >
            {/* Icon Container */}
            <div className={`
              relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
              ${isSelected 
                ? 'bg-white/20 backdrop-blur-sm' 
                : 'bg-white/10 backdrop-blur-sm group-hover:bg-white/20'
              }
            `}>
              <IconComponent 
                className={`
                  w-6 h-6 transition-all duration-300
                  ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                `} 
              />
            </div>
            
            {/* Category Name */}
            <span className={`
              text-xs font-medium transition-all duration-300 text-center
              ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}
            `}>
              {category.name}
            </span>
            
            {/* Selection Indicator */}
            {isSelected && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full shadow-lg" />
            )}
          </button>
        );
      })}
    </div>
  );
}
