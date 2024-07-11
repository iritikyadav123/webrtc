import { useEffect, useRef, useState } from "react";

 

 export default function Sender() {
  
    const [socket, setSocket] = useState<WebSocket | null>(null);


    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080');

            socket.onopen=()=>{
                socket.send(JSON.stringify({type : 'sender'}))
            }
            setSocket(socket);
    },[])
        
    async function startSharingViedo() {
        if(!socket) {
            return;
        }
        const pc = new RTCPeerConnection();

        pc.onnegotiationneeded=async()=>{
            console.log('negotiation')
            const offer = await pc?.createOffer();
            await pc?.setLocalDescription(offer);
            socket?.send(JSON.stringify({type: 'createOffer', sdp : pc.localDescription})); 
        }
        
        pc.onicecandidate=(event)=>{
            if(event.candidate) {
                socket.send(JSON.stringify({type: 'iceCandidate', candidate: event.candidate}))
            }
        }

        socket.onmessage = async(event ) => {
             const message = JSON.parse(event.data);
             if(message.type == 'createAnswer') {
                pc?.setRemoteDescription(message.sdp);
             }else if(message.type == 'iceCandidate') {
               if(pc !== null) {
               await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
               }
             }
        }
        const stream = await navigator.mediaDevices.getUserMedia({video : true, audio: false})
        const video = document.createElement('video');
        document.body.appendChild(video);
        video.srcObject = stream
        video.play();
        pc.addTrack(stream.getVideoTracks()[0])

    }
         
    return <div>
        <button onClick={startSharingViedo}>Sender</button>
       
    </div>
 }
