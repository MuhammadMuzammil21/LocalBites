import { useNavigate } from "react-router-dom";

type RestaurantCardProps = {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
};

const RestaurantCard = ({
  id,
  name,
  description,
  image,
  rating,
}: RestaurantCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white shadow-md rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform"
      onClick={() => navigate(`/menu/${id}`)}
    >
      <img src={image} alt={name} className="h-48 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-bold">{name}</h3>
        <p className="text-gray-500 text-sm mt-1">{description}</p>
        <p className="text-yellow-500 font-semibold mt-2">⭐ {rating}</p>
      </div>
    </div>
  );
};

export default RestaurantCard;
