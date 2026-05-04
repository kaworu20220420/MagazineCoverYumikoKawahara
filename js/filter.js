// ===============================
// フィルタ処理（雑誌名・年）
// ===============================

document.addEventListener("DOMContentLoaded", () => {

	const magazineRadios = document.querySelectorAll("input[name='magazine-filter']");
	const yearRadios = document.querySelectorAll("input[name='year-filter']");
	const cells = document.querySelectorAll("td[data-mag][data-year]");

	let selectedMagazine = "ALL";
	let selectedYear = "ALL";

	// -------------------------------
	// 雑誌名フィルタ
	// -------------------------------
	magazineRadios.forEach(radio => {
		radio.addEventListener("change", () => {
			selectedMagazine = radio.value;
			applyFilter();
		});
	});

	// -------------------------------
	// 年フィルタ
	// -------------------------------
	yearRadios.forEach(radio => {
		radio.addEventListener("change", () => {
			selectedYear = radio.value;
			applyFilter();
		});
	});

	// -------------------------------
	// 表示切り替え本体
	// -------------------------------
	function applyFilter() {
		cells.forEach(cell => {
			const mag = cell.dataset.mag;
			const year = cell.dataset.year;

			const matchMagazine = (selectedMagazine === "ALL" || selectedMagazine === mag);
			const matchYear = (selectedYear === "ALL" || selectedYear === year);

			if (matchMagazine && matchYear) {
				cell.style.display = "";
			} else {
				cell.style.display = "none";
			}
		});
	}
});
