import HeroSection from '../components/HeroSection';
import Navbar from '../components/layout/Navbar';

const Home = () => {
  console.log("Home rendered");

  return (
    <div className="bg-black">
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default Home;
// const Home = () => {
//   return (
//     <div className="p-10 text-2xl text-green-600 font-bold">
//       Hello from Home!
//     </div>
//   );
// };
// export default Home;