import type React from "react";
import { useEffect, useState } from "react";
import "./ClearAnimation.css";

interface SparkleProps {
	id: number;
	left: string;
	top: string;
	size: string;
	animationDuration: string;
	rotation: string;
	delay: string;
}

export const ClearAnimation: React.FC = () => {
	const [visible, setVisible] = useState<boolean>(false);
	const [sparkles, setSparkles] = useState<SparkleProps[]>([]);

	const generateSparkles = (): SparkleProps[] => {
		const newSparkles: SparkleProps[] = [];
		for (let i = 0; i < 30; i++) {
			newSparkles.push({
				id: i,
				left: `${Math.random() * 100}%`,
				top: `${Math.random() * 100}%`,
				size: `${Math.random() * 10 + 5}px`,
				animationDuration: `${Math.random() * 1.2 + 2.1}s`,
				rotation: `rotate(${Math.random() * 360}deg)`,
				delay: `${Math.random() * 0.2}s`,
			});
		}
		return newSparkles;
	};

	useEffect(() => {
		setVisible(true);
		setSparkles(generateSparkles());

		const timer = setTimeout(() => {
			setVisible(false);
		}, 30000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="sparkle-container">
			{visible && (
				<>
					{sparkles.map((sparkle) => (
						<div
							key={sparkle.id}
							className="sparkle"
							style={{
								left: sparkle.left,
								top: sparkle.top,
								width: sparkle.size,
								height: sparkle.size,
								animationDuration: sparkle.animationDuration,
								transform: sparkle.rotation,
								animationDelay: sparkle.delay,
							}}
						>
							<svg viewBox="0 0 24 24" fill="none">
								<path
									d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
									fill="gold"
								/>
							</svg>
						</div>
					))}
				</>
			)}
		</div>
	);
};
