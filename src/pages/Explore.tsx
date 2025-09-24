import Navigation from "@/components/Navigation";

const videos = [
  {
    id: "aaNUOOFXf-E",
    title: "Jharkhand Tourism: Best Places to Visit",
    description: "A comprehensive travel guide to some of the best tourist places in Jharkhand, including Deoghar, Shikharji, and Patratu Valley.",
  },
  {
    id: "UmPTEgQ_AxM",
    title: "Exploring Ranchi: Must-Visit Spots",
    description: "A vlog exploring the capital city of Jharkhand, Ranchi. This video covers tourist places like Dassam Falls, Sun Temple, and Ranchi Lake.",
  },
  {
    id: "MEhP9KbTaAU",
    title: "Top 7 Best Places to Visit in Jharkhand",
    description: "A list of the top 7 best places to visit in Jharkhand, including Ranchi, Jamshedpur, Hazaribagh, Deoghar, Bokaro, Dhanbad, and Palamu.",
  },
  {
    id: "Ic1HIhK81Qg",
    title: "Discover Jharkhand",
    description: "A beautiful cinematic video showcasing the diverse landscapes and culture of Jharkhand.",
  },
  {
    id: "aXOVKVqOdvY",
    title: "Jharkhand 360° Virtual Tour",
    description: "Experience a virtual tour of Jharkhand's beautiful landscapes in 360 degrees.",
  },
];

const Explore = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Explore Jharkhand
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the beauty of Jharkhand through these videos.
          </p>
        </div>
        <div className="space-y-8">
          {videos.map((video) => (
            <div key={video.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{video.title}</h2>
                <p className="text-muted-foreground">{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;