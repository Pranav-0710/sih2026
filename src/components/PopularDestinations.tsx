import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import baidyanathTemple from "@/assets/baidyanath_temple.png";
import betlaNationalPark from "@/assets/betla_national_park.png";
import dassamFalls from "@/assets/dassam_falls.png";
import hundruFalls from "@/assets/hundru_falls.png";
import jagannathTempleRanchi from "@/assets/jagannath_temple_ranchi.png";
import rajrappaTemple from "@/assets/rajrappa_temple.png";


const destinations = [
  {
    name: "Baidyanath Temple",
    description: "A sacred Hindu temple complex and one of the twelve Jyotirlingas.",
    image: baidyanathTemple,
  },
  {
    name: "Betla National Park",
    description: "A beautiful national park with a diverse range of wildlife.",
    image: betlaNationalPark,
  },
  {
    name: "Dassam Falls",
    description: "A stunning natural waterfall with a 144-foot drop.",
    image: dassamFalls,
  },
  {
    name: "Hundru Falls",
    description: "One of the highest waterfalls in Jharkhand, a must-visit for nature lovers.",
    image: hundruFalls,
  },
  {
    name: "Jagannath Temple, Ranchi",
    description: "A 17th-century temple built in the same style as the Puri Jagannath Temple.",
    image: jagannathTempleRanchi,
  },
  {
    name: "Rajrappa Temple",
    description: "A unique temple dedicated to the goddess Chhinnamasta.",
    image: rajrappaTemple,
  },
];

const PopularDestinations = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Popular Destinations</h2>
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
