let acceptOffer = document.getElementById("accept-offer");
let connectionStatus = false;

// process starts when user 2 accepts offer from user 1
acceptOffer.addEventListener("click", async () => {
	const offer = JSON.parse(document.getElementById("answer-sdp").value);
	console.log(offer);
	const remoteConnection = await new RTCPeerConnection();

	// for putting system comments (user guidance)
	let comments = document.getElementById("system-comments");

	// on getting new ice candidate
	remoteConnection.onicecandidate = (e) => {
		console.log(" NEW ice candidnate!! on localconnection reprinting SDP ");
		console.log(JSON.stringify(remoteConnection.localDescription));
		const offerSDP = document.getElementById("offer-sdp");
		// display the value in offer box
		offerSDP.value = JSON.stringify(remoteConnection.localDescription);
		comments.innerHTML = `System Comments: Paste the offer (left box) in other browser answer.`;
	};

	remoteConnection.ondatachannel = (e) => {
		const receiveChannel = e.channel;
		receiveChannel.onmessage = (e) => {
			console.log("messsage received from A:" + e.data);
			let chatBox = document.getElementById("chat-history");
			// display message from user A
			chatBox.innerHTML = `Message from user A: ${e.data}`;
		};
		receiveChannel.onopen = (e) => {
			console.log("open!!!!");
			connectionStatus = true;
			comments.innerHTML = `System Comments: Whoaa!! Now you can chat with User 1.`;
		};
		receiveChannel.onclose = (e) => {
			console.log("closed!!!!!!");
			connectionStatus = false;
			comments.innerHTML = `System Comments: The channel is closed, you cannot chat.`;
		};
		remoteConnection.channel = receiveChannel;
	};

	await remoteConnection.setRemoteDescription(offer).then((a) => {
		console.log("done");
	});

	//create answer
	await remoteConnection
		.createAnswer()
		.then((a) => remoteConnection.setLocalDescription(a))
		.then((a) =>
			console.log(JSON.stringify(remoteConnection.localDescription))
		);

	// functions for sending chat messages
	document.getElementById("send-message").addEventListener("click", () => {
		let messageBox = document.getElementById("message-box");
		// sanity check for sending messages
		if (
			connectionStatus &&
			messageBox.value != null &&
			messageBox.value != ""
		) {
			remoteConnection.channel.send(messageBox.value);
			messageBox.value = "";
		}
	});
});
