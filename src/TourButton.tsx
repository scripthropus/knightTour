import { useState } from "react";
import { makeTour, type Position } from "./main.ts";

interface TourButtonProps {
  onTourGenerated?: (positions: Position[]) => void;
}

export const TourButton = ({ onTourGenerated }: TourButtonProps) => {
  const [tour, setTour] = useState<Position[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTour = () => {
    setIsGenerating(true);
    // ツアーを生成
    const newTour = makeTour(5, "a1");
    setTour(newTour);
    // 親コンポーネントに通知
    if (onTourGenerated) {
      onTourGenerated(newTour);
    }
    setIsGenerating(false);
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleGenerateTour}
        disabled={isGenerating}
      >
        {isGenerating ? "生成中..." : "ナイトツアーを生成"}
      </button>
      {tour.length > 0 && (
        <div>
          ツアー順序: {tour.join(" → ")}
        </div>
      )}
    </div>
  );
};