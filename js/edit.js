// ===============================
// コメント編集 UI 制御
// ===============================

let items = []; // items.json の内容（C# が差し込む前提）

document.addEventListener("DOMContentLoaded", () => {

	// 編集 UI を生成（HTML に埋め込まれていない場合は自動生成）
	createEditArea();

	// 編集ボタンにイベントを付与
	document.querySelectorAll(".edit-button").forEach(btn => {
		btn.addEventListener("click", () => {
			const index = Number(btn.dataset.index);
			openEditor(index);
		});
	});

	// 保存ボタン
	document.getElementById("save-comment").addEventListener("click", async () => {
		const index = Number(document.getElementById("save-comment").dataset.index);
		const newComment = document.getElementById("edit-comment").value;

		await saveComment(index, newComment);

		alert("保存したよ！");
		location.reload();
	});

	// キャンセルボタン
	document.getElementById("cancel-edit").addEventListener("click", () => {
		document.getElementById("edit-area").style.display = "none";
	});
});

// ===============================
// 編集 UI を開く
// ===============================
function openEditor(index) {
	const item = items[index];
	document.getElementById("edit-comment").value = item.Comment ?? "";
	document.getElementById("save-comment").dataset.index = index;
	document.getElementById("edit-area").style.display = "block";
}

// ===============================
// Cloudflare Workers に保存依頼
// ===============================
async function saveComment(index, newComment) {
	const workerUrl = "https://YOUR_WORKER_URL/update";

	await fetch(workerUrl, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ index, newComment })
	});
}

// ===============================
// 編集 UI を生成
// ===============================
function createEditArea() {
	const div = document.createElement("div");
	div.id = "edit-area";
	div.style.display = "none";
	div.style.padding = "10px";
	div.style.border = "1px solid #ccc";
	div.style.margin = "20px 0";
	div.style.background = "#f8f8f8";

	div.innerHTML = `
        <h3>コメント編集</h3>
        <textarea id="edit-comment" style="width:100%; height:120px;"></textarea>
        <div style="margin-top:10px;">
            <button id="save-comment">保存</button>
            <button id="cancel-edit">キャンセル</button>
        </div>
    `;

	document.body.appendChild(div);
}
