export default {
	async fetch(request, env) {
		try {
			// CORS 許可（必要なら origin を限定してもOK）
			if (request.method === "OPTIONS") {
				return new Response(null, {
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Methods": "POST, OPTIONS",
						"Access-Control-Allow-Headers": "Content-Type",
					},
				});
			}

			if (request.method !== "POST") {
				return new Response("POST only", { status: 405 });
			}

			const { index, newComment } = await request.json();

			if (index === undefined || newComment === undefined) {
				return new Response("Invalid payload", { status: 400 });
			}

			const owner = env.GITHUB_OWNER;
			const repo = env.GITHUB_REPO;
			const path = "items.json";
			const token = env.GITHUB_TOKEN;

			// ============================
			// 1. items.json の最新 SHA を取得
			// ============================
			const getRes = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
				{
					headers: {
						Authorization: `token ${token}`,
						"User-Agent": "CloudflareWorker",
					},
				}
			);

			if (!getRes.ok) {
				return new Response("Failed to fetch items.json", { status: 500 });
			}

			const fileData = await getRes.json();
			const sha = fileData.sha;
			const items = JSON.parse(atob(fileData.content));

			// ============================
			// 2. items.json を更新
			// ============================
			items[index].Comment = newComment;

			const updatedContent = btoa(JSON.stringify(items, null, 2));

			// ============================
			// 3. GitHub に PUT
			// ============================
			const putRes = await fetch(
				`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
				{
					method: "PUT",
					headers: {
						Authorization: `token ${token}`,
						"Content-Type": "application/json",
						"User-Agent": "CloudflareWorker",
					},
					body: JSON.stringify({
						message: `Update comment index ${index}`,
						content: updatedContent,
						sha: sha,
					}),
				}
			);

			if (!putRes.ok) {
				return new Response("Failed to update items.json", { status: 500 });
			}

			return new Response("OK", {
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
			});

		} catch (err) {
			return new Response("Error: " + err.message, { status: 500 });
		}
	},
};
