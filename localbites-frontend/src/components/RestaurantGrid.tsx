// src/components/RestaurantGrid.tsx

import RestaurantCard from "./RestaurantCard";

const dummyRestaurants = [
  {
    name: "Spicy Kitchen",
    cuisine: "Desi",
    image: "/images/desi.jpg",
  },
  {
    name: "Pizza Mania",
    cuisine: "Pizza",
    image: "/images/pizza.jpg",
  },
  {
    name: "Burger Bros",
    cuisine: "Burgers",
    image: "/images/burger.jpg",
  },
  {
    name: "Chopsticks",
    cuisine: "Chinese",
    image: "/images/chinese.jpg",
  },
];

interface Props {
  selectedCategory: string;
}

export default function RestaurantGrid({ selectedCategory }: Props) {
  const filtered = selectedCategory === "All"
    ? dummyRestaurants
    : dummyRestaurants.filter(r => r.cuisine === selectedCategory);

  return (
    <section className="px-4 md:px-16 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.map((rest, idx) => (
        <RestaurantCard id={""} description={""} rating={0} key={idx} {...rest} />
      ))}
    </section>
  );
}
