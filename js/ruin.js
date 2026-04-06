const ENCODED_NAME_KEY = "n";
const RAW_NAME_KEY = "r";

function getNameFromSearchParams() {
	const url = new URL(window.location.toLocaleString());
	const { searchParams } = url;
	const encoded = searchParams.get(ENCODED_NAME_KEY);
	const raw = searchParams.get(RAW_NAME_KEY);

	if (raw) {
		try {
			const newEncoded = btoa(raw);
			searchParams.set(ENCODED_NAME_KEY, newEncoded);
			searchParams.delete(RAW_NAME_KEY);
			window.location.search = searchParams;

			return raw;
		} catch (err) {
			console.error(err);
		}
	}

	return encoded || "";
}

function replaceName() {
	const n = getNameFromSearchParams();
	const url = new URL(window.location);
	const confettiParam = url.searchParams.get("c");
	const againParam = url.searchParams.get("a");

	try {
		const decodedName = atob(n);
		if (decodedName) {
			document.getElementById("ruiner").innerText = decodedName;
			// Add "Again." if 'a' param is present, preserving the ruiner span
			if (againParam !== null) {
				const msgBox = document.querySelector(".message-box .content");
				if (msgBox) {
					// Only add if not already present
					const againSpan = msgBox.querySelector(".again-dot");
					if (!againSpan) {
						const span = document.createElement("span");
						span.className = "again-dot";
						span.textContent = " Again.";
						msgBox.appendChild(span);
					}
				}
			}
			// Confetti control: 'c' param (0 disables, 1 enables, default enabled)
			const confettiEnabled = confettiParam === null || confettiParam === "1";
			if (confettiEnabled && typeof confetti === "function") {
				const ruiner = document.getElementById("ruiner");
				let origin = { x: 0.5, y: 0.6 };
				if (ruiner) {
					const rect = ruiner.getBoundingClientRect();
					origin = {
						x: (rect.left + rect.width / 2) / window.innerWidth,
						y: (rect.top + rect.height / 2) / window.innerHeight
					};
				}
				confetti({
					particleCount: 200,
					spread: 70,
					origin,
					shapes: ["emoji"],
					shapeOptions: {
						emoji: {
							value: ["👎", "😢"]
						}
					},
					scalar: 2
				});
			}
		}
	} catch (err) {
		console.error(err);
	}
}

document.onreadystatechange = (evt) => {
	if (evt.target.readyState === "complete") {
		replaceName();
		const ruiner = document.getElementById("ruiner");
		if (!ruiner) return;

		function showInput(currentName = "") {
			const input = document.createElement("input");
			input.type = "text";
			input.value = currentName;
			input.placeholder = "name";
			input.style.fontSize = "inherit";
			input.style.width = Math.max(200, currentName.length * 32) + "px";
			ruiner.replaceWith(input);
			input.focus();

			let saved = false;
			function save() {
				if (saved) return;
				saved = true;
				const newName = input.value.trim();
				// Always get latest params from URL
				const url = new URL(window.location);
				const confettiParam = url.searchParams.get("c");
				const againParam = url.searchParams.get("a");
				if (newName && newName !== currentName) {
					url.searchParams.set("r", newName);
					if (confettiParam !== null) url.searchParams.set("c", confettiParam);
					if (againParam !== null) url.searchParams.set("a", againParam);
					window.location.search = url.searchParams;
				} else if (!newName) {
					// If blank, keep input box and do not reload or restore span
					saved = false;
					input.value = "";
					input.focus();
				} else {
					window.location.reload();
				}
			}

			input.addEventListener("blur", save);
			input.addEventListener("keydown", (e) => {
				if (e.key === "Enter") {
					save();
				} else if (e.key === "Escape") {
					input.replaceWith(ruiner);
					ruiner.focus && ruiner.focus();
				}
			});
		}

		// Show input if name is blank
		if (!ruiner.innerText.trim()) {
			showInput("");
		}

		ruiner.addEventListener("dblclick", () => {
			showInput(ruiner.innerText);
		});
	}
};
