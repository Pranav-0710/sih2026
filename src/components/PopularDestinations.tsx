import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const destinations = [
  {
    name: "Rumtek Monastery",
    description: "The Dharma Chakra Centre — largest monastery in Sikkim and principal seat of the Karma Kagyu lineage.",
    image: "/vr-assets/rumtek-monastery.jpg",
  },
  {
    name: "Pemayangtse Monastery",
    description: "The 'Perfect Sublime Lotus', founded 1705 — head of Sikkim's Nyingma monasteries.",
    image: "/vr-assets/pemayangtse-monastery.jpg",
  },
  {
    name: "Tashiding Monastery",
    description: "Widely held to be Sikkim's holiest monastery, home to the sin-cleansing Thongwa Rangdrol chorten.",
    image: "/vr-assets/tashiding-monastery.jpg",
  },
  {
    name: "Enchey Monastery",
    description: "'The Solitary Temple' above Gangtok, renowned for its masked Cham dances.",
    image: "/vr-assets/enchey-monastery.jpg",
  },
];

const PopularDestinations = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-8">Popular Destinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((destination) => (
            <Card key={destination.name} className="overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <CardHeader className="p-0">
                <img src={destination.image} alt={destination.name} className="w-full h-64 object-cover" />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-xl font-bold mb-2">{destination.name}</CardTitle>
                <CardDescription>{destination.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button>Explore</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
