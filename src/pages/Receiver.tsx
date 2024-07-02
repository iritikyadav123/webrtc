import { useEffect, useRef } from "react"

 

  export default function Sender() {
    const videoRef = useRef<HTMLVideoElement>(null);
    let pc : RTCPeerConnection | null = null;
    useEffect(()=>{
        const socket = new WebSocket('ws://localhost:8080');

            socket.onopen=()=>{
                socket.send(JSON.stringify({type : 'receiver'}))
            }

            socket.onmessage=async(event)=>{
                const message = JSON.parse(event.data); 
                if(message.type == 'createOffer') {
                      pc = new RTCPeerConnection();
                     pc.setRemoteDescription(message.sdp);

                     pc.onicecandidate=(event)=>{
                        if(event.candidate) {
                            socket.send(JSON.stringify({type: 'iceCandidate', candidate: event.candidate}))
                        }
                    }
                      pc.ontrack=(event)=>{
                            // console.log(event);
                            // if(videoRef.current) {
                            //     videoRef.current.srcObject = new MediaStream([event.track])
                            // }
                            const video = document.createElement('video');
                            document.body.appendChild(video);
                            video.srcObject = new MediaStream([event.track]);
                            video.play();
                      }

                     const answer= await pc.createAnswer();
                    await pc.setLocalDescription(answer);
                    socket.send(JSON.stringify({type: "createAnswer" , sdp : pc.localDescription}));

                }else if(message.type == 'iceCandidate') {
                  if(pc != null) {
                    await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
                  }
                }
            }
    },[])

    return <div>
      {/* <video ref={videoRef}></video> */}
    </div>
 }