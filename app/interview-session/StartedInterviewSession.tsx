import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "../gather/Button"
import { useSessionToken } from "./use-session-token"
import { InterviewPreparationSession } from "../model/Plan";


const REALTIME_API_URL = "https://api.openai.com/v1/realtime";
const REALTIME_API_MODEL = "gpt-4o-mini-realtime-preview-2024-12-17";


const getPrompt = (job: any, session: InterviewPreparationSession): string => {
    return `
You are an AI-powered interview coach assisting a user preparing for a job interview. The session is voice-based, and your role is to simulate a realistic interview experience while providing constructive feedback and guidance.

Context about the session:

Job Posting Details:
${JSON.stringify(job)}

Session information:
${JSON.stringify(session)}

Your Task:

Start by introducing yourself briefly and setting the agenda for the session based on the user's goals and preparation notes.
Conduct a mock interview with questions tailored to the job role and company information.
If applicable, ask follow-up questions to simulate a real interview dynamic.
Provide constructive, actionable feedback after each response. Focus on:
Clarity and structure of the answer.
Relevance to the job role and company.
Professional tone and delivery.
Adjust your coaching style and feedback based on the user’s responses and progress during the session.
Maintain an encouraging and professional tone throughout the session. Conclude by summarizing key takeaways, providing suggestions for further improvement, and wishing the user luck for their interview.
Now start the session by introducing yourself and setting the agenda. Good luck!
`
}


const connect = async (audioElement: HTMLAudioElement, connection: RTCPeerConnection, key: string, prompt: string) => {

    // Set up to play remote audio from the model
    connection.ontrack = e => audioElement.srcObject = e.streams[0];
    
    // Add local audio track for microphone input in the browser
    const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });
    const [track] = mediaStream.getTracks();
    connection.addTrack(track);

    // Set up data channel for sending and receiving events
    const dataChannel = connection.createDataChannel("oai-events");

    // Wait for the data channel to open before sending messages
    dataChannel.addEventListener("message", (e) => {
        console.log(e)
    });

    dataChannel.addEventListener("error", (e) => {
        console.error("Data channel error:", e);
    });

    // Wait for the data channel to open before sending messages
    dataChannel.addEventListener("open", () => {
        if (dataChannel.readyState === "open") {
            dataChannel.send(JSON.stringify({ type: "conversation.item.create", item: {
                id: 'msg_001',
                type: 'message',
                role: 'system',
                content: [{
                    type: 'input_text',
                    text: prompt,
                }],
            } }));
        }
    });

    // Start the session using the Session Description Protocol (SDP)
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);

    const sdpResponse = await fetch(`${REALTIME_API_URL}?model=${REALTIME_API_MODEL}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/sdp"
        },
    });

    const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpResponse.text(),
    };

    await connection.setRemoteDescription(answer);

    return { connection, dataChannel, mediaStream }
}

const closeConnection = async (connection: RTCPeerConnection) => {
    //if (connection.connectionState === "connected" || connection.connectionState === "failed") {
    connection.close();
    //}

    // Stop all media tracks (senders)
    connection.getSenders().forEach(sender => {
        if (sender.track !== null) {
            sender.track.stop();
        }
    });
};

const formatRemainingTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = ((time % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? '0' : ''}${seconds}`;
}

interface TimerProps {
    duration: number;
    startTime: number;
}

const Timer: React.FC<TimerProps> = ({ duration, startTime }) => {
    const [time, setTime] = useState(duration - (new Date().getTime() - startTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(duration - (new Date().getTime() - startTime));
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [duration, startTime]);

    return <div className="prose">
        <p className="text-xl font-mono">Remaining time: {formatRemainingTime(time)}</p>
    </div>
}


interface StartedInterviewSession {
    job: any;
    session: InterviewPreparationSession;
    onQuit: () => void;
}

export const StartedInterviewSession: React.FC<StartedInterviewSession> = ({ job, session, onQuit }) => {
    const { status, sessionToken, refetch } = useSessionToken()

    const retry = () => {
        refetch()
    }
    const quit = () => {
        onQuit()
    }

    const audioRef = useCallback(
        (node: HTMLAudioElement) => {
            if (status == 'success') {
                const connection = new RTCPeerConnection();
                connect(node, connection, sessionToken!, prompt)
                return () => {
                    closeConnection(connection)
                }
            }
        },
        [status, sessionToken, session],
    )

    const duration = useMemo(() => session.durationInMinutes * 60 * 1000,[session.durationInMinutes])
    const [startTime] = useState(new Date().getTime())

    useEffect(() => {
        const interval = setInterval(() => {
            quit()
        }, session.durationInMinutes * 60 * 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])

    const prompt = getPrompt(job, session)

    if (status == 'error') {
        return (
            <div className="flex flex-col space-y-5">
                <div>Error while loading the session</div>
                <div><Button onClick={retry}>Retry</Button></div>
            </div>
        )
    }

    if (status == 'pending') {
        return <div><span className="loading loading-spinner loading-lg"></span></div>
    }

    return <div className="prose flex flex-col space-y-4">
        <audio autoPlay ref={audioRef} />
        <p>
            You are now in a voice-based interview session. Please ensure you have a microphone and speaker enabled.
        </p>
        <div className="pb-6">
            <Timer duration={duration} startTime={startTime} />
        </div>
        <div>
            <Button primary onClick={quit}>Quit this session</Button>
        </div>
    </div>
}