let offerButton = document.getElementById("create-offer");
// all things will be initiated after offer creation
offerButton.addEventListener("click", doTask, false);

let connectionStatus = false;

function doTask() {
	const localConnection = new RTCPeerConnection();
	// on getting new ice candidate
	localConnection.onicecandidate = (e) => {
		console.log(" NEW ice candidnat!! on localconnection reprinting SDP ");
		console.log(JSON.stringify(localConnection.localDescription));
		let offer = document.getElementById("offer-sdp");
		// display the value in offer box
		offer.value = JSON.stringify(localConnection.localDescription);
	};

	const sendChannel = localConnection.createDataChannel("sendChannel");
	sendChannel.onmessage = (e) => {
		console.log("messsage received!!!" + e.data);
		let chatBox = document.getElementById("chat-history");
		chatBox.innerHTML = `Message from user B:
		 ${e.data}`;
	};

	// for putting system comments (user guidance)
	let comments = document.getElementById("system-comments");

	sendChannel.onopen = (e) => {
		console.log("open!!!!");
		connectionStatus = true;
		comments.innerHTML = `System Comments: Whoaa!! Now you can chat with User 2.`;
	};
	sendChannel.onclose = (e) => {
		console.log("closed!!!!!!");
		connectionStatus = false;
		comments.innerHTML = `System Comments: The channel is closed, you cannot chat.`;
	};

	localConnection
		.createOffer()
		.then((o) => localConnection.setLocalDescription(o));

	// ask user to put offer in other browser
	comments.innerHTML = `System Comments: Paste this offer in the other browser.`;

	let acceptOffer = document.getElementById("accept-offer");
	acceptOffer.addEventListener("click", () => {
		const answer = JSON.parse(document.getElementById("answer-sdp").value);
		localConnection.setRemoteDescription(answer).then((a) => {
			console.log("done");
		});
	});

	// functions for sending chat messages
	document.getElementById("send-message").addEventListener("click", () => {
		let messageBox = document.getElementById("message-box");
		// sanity check for sending messages
		if (
			connectionStatus &&
			messageBox.value != null &&
			messageBox.value != ""
		) {
			sendChannel.send(messageBox.value);
			messageBox.value = "";
		}
	});
}
