function loadOptions() {
	browser.storage.local.get().then((res) => {
		showOption(res.noTitles);
	});
}

function showOption(state) {
	document.querySelector("#without-titles").checked = state;
}


function updateOptions(e) {
	browser.storage.local.set({
		noTitles: document.querySelector('#without-titles').checked
	});

	e.preventDefault();
}

document.addEventListener('DOMContentLoaded', loadOptions);
document.querySelector("form").addEventListener("submit", updateOptions);