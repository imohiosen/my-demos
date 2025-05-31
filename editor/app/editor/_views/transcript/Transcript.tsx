import { Card } from "@/components/ui/card";
import SceneTranscript from "./SceneTranscript";

type Props = {};

const Transcript = (props: Props) => {
  return (
    <Card className="h-full p-8">
      <input
        placeholder="Untitled Draft"
        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 text-3xl font-semibold text-primary overflow-hidden"
      />
      {[1, 2, 3, 4, 5, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((e, k) => {
        return (
          <div key={k}>
            <SceneTranscript />
          </div>
        );
      })}
    </Card>
  );
};

export default Transcript;
