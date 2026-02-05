function replaceName() {
	const url = new URL(window.location.toLocaleString());
	const urlParams = url.searchParams;
	const n = urlParams.get("n");

	try {
		const decodedName = atob(n);
		if (decodedName) {
			document.getElementById("ruiner").innerText = decodedName;
		}
	} catch (err) {
		console.error(err);
	}
}

document.onreadystatechange = (evt) => {
	if (evt.target.readyState === "complete") replaceName();
};
