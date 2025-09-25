import PageLayout from "@/components/PageLayout";
import { GamesHub } from "@/components/funscapes/GamesHub";
import { useParams } from "react-router-dom";

const ArVrExperience = () => {
  const { gameId } = useParams<{ gameId: string }>();

  return (
    <PageLayout>
      <GamesHub initialGameId={gameId} />
    </PageLayout>
  );
};

export default ArVrExperience;
