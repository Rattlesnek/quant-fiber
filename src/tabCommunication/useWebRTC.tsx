import { useEffect, useRef } from "react";

interface UseWebRTCResult<S> {
  sendData: (data: S) => void;
  startConnection: () => void;
  closeConnection: () => void;
}

export function useWebRTC<S>(
  broadcastChannelName: string,
  onReceiveData?: (data: S) => void
): UseWebRTCResult<S> {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const sendChannelRef = useRef<RTCDataChannel | null>(null);
  const receiveChannelRef = useRef<RTCDataChannel | null>(null);
  const signalingRef = useRef<BroadcastChannel>(
    new BroadcastChannel(broadcastChannelName)
  );

  useEffect(() => {
    signalingRef.current.onmessage = (e) => {
      switch (e.data.type) {
        case "offer":
          handleOffer(e.data);
          break;
        case "answer":
          handleAnswer(e.data);
          break;
        case "candidate":
          handleCandidate(e.data);
          break;
        case "ready":
          if (pcRef.current) {
            console.log("already in call, ignoring");
            return;
          }
          break;
        case "bye":
          if (pcRef.current) {
            hangup();
          }
          break;
        default:
          console.log("unhandled", e);
          break;
      }
    };
    signalingRef.current.postMessage({ type: "ready" });
  }, []);

  const startConnection = async () => {
    pcRef.current = createPeerConnection();
    sendChannelRef.current = pcRef.current.createDataChannel("sendDataChannel");
    sendChannelRef.current.onopen = onSendChannelStateChange;
    sendChannelRef.current.onmessage = onSendChannelMessageCallback;
    sendChannelRef.current.onclose = onSendChannelStateChange;

    const offer = await pcRef.current.createOffer();
    signalingRef.current.postMessage({ type: "offer", sdp: offer.sdp });
    await pcRef.current.setLocalDescription(offer);
  };

  const sendData = (data: S) => {
    if (sendChannelRef.current) {
      sendChannelRef.current.send(JSON.stringify(data));
    } else {
      receiveChannelRef.current?.send(JSON.stringify(data));
    }
  };

  const handleOffer = async (offer: any) => {
    if (pcRef.current) {
      console.error("existing peerconnection");
      return;
    }
    pcRef.current = createPeerConnection();
    pcRef.current.ondatachannel = receiveChannelCallback;
    await pcRef.current.setRemoteDescription(offer);

    const answer = await pcRef.current.createAnswer();
    signalingRef.current.postMessage({ type: "answer", sdp: answer.sdp });
    await pcRef.current.setLocalDescription(answer);
  };

  const receiveChannelCallback = (event: any) => {
    receiveChannelRef.current = event.channel;
    if (!receiveChannelRef.current) {
      console.log("no receiveCannel");
      return;
    }
    receiveChannelRef.current.onmessage = onReceiveChannelMessageCallback;
    receiveChannelRef.current.onopen = onReceiveChannelStateChange;
    receiveChannelRef.current.onclose = onReceiveChannelStateChange;
  };

  const onReceiveChannelMessageCallback = (event: any) => {
    const data = JSON.parse(event.data) as S;
    onReceiveData?.(data);
  };

  const onSendChannelMessageCallback = (event: any) => {
    const data = JSON.parse(event.data) as S;
    onReceiveData?.(data);
  };

  const onSendChannelStateChange = () => {
    const readyState = sendChannelRef.current?.readyState;
    console.log(`Send channel state is: ${readyState}`);
    if (readyState === "closed") {
      closeConnection();
    }
  };

  const onReceiveChannelStateChange = () => {
    const readyState = receiveChannelRef.current?.readyState;
    console.log(`Receive channel state is: ${readyState}`);
    if (readyState === "closed") {
      closeConnection();
    }
  };

  const closeConnection = () => {
    hangup();
    signalingRef.current.postMessage({ type: "bye" });
  };

  const hangup = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    sendChannelRef.current = null;
    receiveChannelRef.current = null;
    console.log("Closed peer connections");
  };

  const createPeerConnection = () => {
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
      signalingRef.current.postMessage(message);
    };
    return newPc;
  };

  const handleAnswer = async (answer: any) => {
    if (!pcRef.current) {
      console.error("no peerconnection");
      return;
    }
    await pcRef.current.setRemoteDescription(answer);
  };

  const handleCandidate = async (candidate: any) => {
    if (!pcRef.current) {
      console.error("no peerconnection");
      return;
    }
    if (!candidate.candidate) {
      await pcRef.current.addIceCandidate(undefined);
    } else {
      await pcRef.current.addIceCandidate(candidate);
    }
  };

  return { sendData, startConnection, closeConnection };
}
