	document.getElementById("tweetButton").addEventListener("click", function () {
        const pageUrl = encodeURIComponent(window.location.href);
	const text = encodeURIComponent("川原由美子 雑誌表紙ギャラリー");
	const tweetUrl = `https://twitter.com/intent/tweet?text=${text}&url=${pageUrl}`;
	window.open(tweetUrl, "_blank");
    });
