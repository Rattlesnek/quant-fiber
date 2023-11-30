import { RenderParamsWithDate } from "../types";
import { useEffect } from "react";

interface UseWebRTCResult<S> {
  sendData: (data: S) => void;
  startConnection: () => void;
  closeConnection: () => void;
}

let pc: RTCPeerConnection | undefined = undefined;
let sendChannel: RTCDataChannel | undefined = undefined;
let receiveChannel: RTCDataChannel | undefined = undefined;
const signaling: BroadcastChannel = new BroadcastChannel("webrtc");

export function useWebRTC<S>(
  onReceiveData?: (data: S) => void
): UseWebRTCResult<S> {
  /////// PASTED CODE Start

  useEffect(() => {
    signaling.onmessage = (e) => {
      switch (e.data.type) {
        case "offer":
          console.log("offer");
          handleOffer(e.data);
          break;
        case "answer":
          console.log("answer");
          handleAnswer(e.data);
          break;
        case "candidate":
          console.log("candidate");
          handleCandidate(e.data);
          break;
        case "ready":
          console.log("ready");
          // A second tab joined. This tab will enable the start button unless in a call already.
          if (pc) {
            console.log("already in call, ignoring");
            return;
          }
          //startButton.disabled = false;
          break;
        case "bye":
          console.log("bye");
          if (pc) {
            hangup();
          }
          break;
        default:
          console.log("unhandled", e);
          break;
      }
    };
    signaling.postMessage({ type: "ready" });
  }, []);

  async function startConnection() {
    pc = createPeerConnection();
    sendChannel = pc.createDataChannel("sendDataChannel");
    sendChannel.onopen = onSendChannelStateChange;
    sendChannel.onmessage = onSendChannelMessageCallback;
    sendChannel.onclose = onSendChannelStateChange;

    const offer = await pc.createOffer();
    signaling.postMessage({ type: "offer", sdp: offer.sdp });
    await pc.setLocalDescription(offer);
  }

  const sendData = (data: S) => {
    if (sendChannel) {
      sendChannel.send(JSON.stringify(data)); // HACK
    } else {
      receiveChannel?.send(JSON.stringify(data));
    }
    console.log("Sent Data");
    console.log(
      new Date().getTime() - (data as RenderParamsWithDate).time,
      " ms"
    );
  };

  async function handleOffer(offer: any) {
    if (pc) {
      console.error("existing peerconnection");
      return;
    }
    pc = createPeerConnection();
    pc.ondatachannel = receiveChannelCallback;
    await pc.setRemoteDescription(offer);

    const answer = await pc.createAnswer();
    signaling.postMessage({ type: "answer", sdp: answer.sdp });
    await pc.setLocalDescription(answer);
  }

  function receiveChannelCallback(event: any) {
    console.log("Receive Channel Callback");
    receiveChannel = event.channel;
    if (!receiveChannel) {
      console.log("no receiveCannel");
      return;
    }
    receiveChannel.onmessage = onReceiveChannelMessageCallback;
    receiveChannel.onopen = onReceiveChannelStateChange;
    receiveChannel.onclose = onReceiveChannelStateChange;
  }

  function onReceiveChannelMessageCallback(event: any) {
    console.log("Received Data Rec");
    const data = JSON.parse(event.data);
    console.log(
      new Date().getTime() - (data as RenderParamsWithDate).time,
      " ms"
    );
    onReceiveData?.(data);
  }

  function onSendChannelMessageCallback(event: any) {
    console.log("Received Data Send");
    onReceiveData?.(JSON.parse(event.data));
  }

  /////// PASTED CODE End

  return { sendData, startConnection, closeConnection };
}

function onSendChannelStateChange() {
  const readyState = sendChannel?.readyState;
  console.log("Send channel state is: " + readyState);
}

function onReceiveChannelStateChange() {
  const readyState = receiveChannel?.readyState;
  console.log(`Receive channel state is: ${readyState}`);
}

const closeConnection = () => {
  hangup();
  signaling.postMessage({ type: "bye" });
};

async function hangup() {
  if (pc) {
    pc.close();
    pc = undefined;
  }
  sendChannel = undefined;
  receiveChannel = undefined;
  console.log("Closed peer connections");
}

function createPeerConnection() {
  const newPc = new RTCPeerConnection();
  newPc.onicecandidate = (e) => {
    const message: {
      type: string;
      candidate?: string;
      sdpMid?: string | null;
      sdpMLineIndex?: number | null;
    } = {
      type: "candidate",
    };
    if (e.candidate) {
      message.candidate = e.candidate.candidate;
      message.sdpMid = e.candidate.sdpMid;
      message.sdpMLineIndex = e.candidate.sdpMLineIndex;
    }
    signaling.postMessage(message);
  };
  return newPc;
}

async function handleAnswer(answer: any) {
  if (!pc) {
    console.error("no peerconnection");
    return;
  }
  await pc.setRemoteDescription(answer);
}

async function handleCandidate(candidate: any) {
  if (!pc) {
    console.error("no peerconnection");
    return;
  }
  if (!candidate.candidate) {
    await pc.addIceCandidate(undefined);
  } else {
    await pc.addIceCandidate(candidate);
  }
}
