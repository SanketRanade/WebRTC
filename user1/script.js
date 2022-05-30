let offerButton = document.getElementById("create-offer");
offerButton.addEventListener("click", doTask, false);

function doTask() {
	const localConnection = new RTCPeerConnection();

	localConnection.onicecandidate = (e) => {
		console.log(" NEW ice candidnat!! on localconnection reprinting SDP ");
		console.log(JSON.stringify(localConnection.localDescription));
		let offer = document.getElementById("offer-sdp");
		offer.value = JSON.stringify(localConnection.localDescription);
	};

	const sendChannel = localConnection.createDataChannel("sendChannel");
	sendChannel.onmessage = (e) => console.log("messsage received!!!" + e.data);
	sendChannel.onopen = (e) => console.log("open!!!!");
	sendChannel.onclose = (e) => console.log("closed!!!!!!");

	localConnection
		.createOffer()
		.then((o) => localConnection.setLocalDescription(o));

	let comments = document.getElementById("system-comments");
	comments.innerHTML = `System Comments: Paste this offer in the other browser.`;

	let acceptOffer = document.getElementById("accept-offer");
	acceptOffer.addEventListener("click", () => {
		const answer = JSON.parse(document.getElementById("answer-sdp").value);
		localConnection
			.setRemoteDescription(answer)
			.then((a) => console.log("done"));
	});
}

// let temp = document.getElementById("chat-history");
// temp.innerHTML = temp.innerHTML + `\n this is new text`;
