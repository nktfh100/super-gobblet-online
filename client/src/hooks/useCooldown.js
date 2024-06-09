import { useEffect, useState } from "react";

// https://github.com/vincentvella/use-cooldown
const useCooldown = (cooldownTime = 500) => {
	const [cooledDown, setCooledDown] = useState(true);

	useEffect(() => {
		let cooldownTimer;

		if (!cooledDown) {
			cooldownTimer = window.setTimeout(
				() => setCooledDown(true),
				cooldownTime
			);
		}

		return () => window.clearTimeout(cooldownTimer);
	}, [cooledDown]);

	return [cooledDown, setCooledDown];
};

export default useCooldown;
