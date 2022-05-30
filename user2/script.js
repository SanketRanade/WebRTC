let acceptOffer = document.getElementById("accept-offer");
acceptOffer.addEventListener("click", async () => {
	const offer = JSON.parse(document.getElementById("answer-sdp").value);
	console.log(offer);
	const remoteConnection = await new RTCPeerConnection();

	remoteConnection.onicecandidate = (e) => {
		console.log(" NEW ice candidnate!! on localconnection reprinting SDP ");
		console.log(JSON.stringify(remoteConnection.localDescription));
		const offerSDP = document.getElementById("offer-sdp");
		offerSDP.value = JSON.stringify(remoteConnection.localDescription);
	};

	remoteConnection.ondatachannel = (e) => {
		const receiveChannel = e.channel;
		receiveChannel.onmessage = (e) =>
			console.log("messsage received from A:" + e.data);
		receiveChannel.onopen = (e) => console.log("open!!!!");
		receiveChannel.onclose = (e) => console.log("closed!!!!!!");
		remoteConnection.channel = receiveChannel;
	};

	await remoteConnection
		.setRemoteDescription(offer)
		.then((a) => console.log("done"));

	//create answer
	await remoteConnection
		.createAnswer()
		.then((a) => remoteConnection.setLocalDescription(a))
		.then((a) =>
			console.log(JSON.stringify(remoteConnection.localDescription))
		);
});

//send the anser to the client
