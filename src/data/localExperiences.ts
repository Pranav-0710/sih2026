export interface LocalExperience {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  mapsUrl: string;
}

export const localExperiences: LocalExperience[] = [
  {
    id: "nimtho",
    title: "Nimtho",
    description: "Traditional Sikkimese cuisine served with locally sourced ingredients.",
    category: "FOOD",
    image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?q=80&w=2069&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/Nimtho+Restaurant+Sikkim",
  },
  {
    id: "mayal-lyang",
    title: "Mayal Lyang Homestay",
    description: "Experience authentic Lepcha hospitality in a serene village setting.",
    category: "STAY",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/Mayal+Lyang+Homestay+Sikkim",
  },
  {
    id: "temi-tea",
    title: "Temi Tea Garden",
    description: "Sikkim's only tea estate producing world-famous organic tea.",
    category: "LOCAL PRODUCT",
    image: "https://images.unsplash.com/photo-1594910398660-f823901b0b4b?q=80&w=2070&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/Temi+Tea+Garden+Sikkim",
  },
  {
    id: "directorate-handicrafts",
    title: "Directorate of Handicrafts",
    description: "Authentic handmade carpets, wooden masks, and thangka paintings.",
    category: "HANDICRAFTS",
    image: "https://images.unsplash.com/photo-1602498456745-e9503b30470b?q=80&w=1974&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/Directorate+of+Handicrafts+and+Handloom+Gangtok",
  },
  {
    id: "lal-bazaar",
    title: "Lal Bazaar",
    description: "Vibrant traditional market offering local produce and crafts.",
    category: "MARKET",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/Lal+Bazaar+Gangtok",
  },
  {
    id: "taste-of-tibet",
    title: "Taste of Tibet",
    description: "Popular spot for authentic Tibetan momos and thukpa in Gangtok.",
    category: "FOOD",
    image: "https://images.unsplash.com/photo-1529124443180-2d64f00db12c?q=80&w=2070&auto=format&fit=crop",
    mapsUrl: "https://www.google.com/maps/search/Taste+of+Tibet+Gangtok",
  },
];
