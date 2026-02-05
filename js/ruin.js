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
