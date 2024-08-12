import React, { useEffect, useState, useRef } from "react"
import { MessageStore } from "../../stores"
import { IconX } from "../../assets/Icons"

type messageData = {
    message: string,
    id: number
}

const Notification: React.FC = () => {
    const messageStore = MessageStore.getInstance()
    const [messages, setMessages] = useState<messageData[]>([])
    const [visibleMessage, setVisibleMessage] = useState<messageData | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleMessage = (message: string) => {
            setMessages((oldData) => [
                ...oldData,
                { message: message, id: Date.now() }
            ])
        }

        const listener = messageStore.onMessage(handleMessage)

        return () => {
            listener()
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (progressRef.current) {
                clearInterval(progressRef.current);
              }
        }
    }, [messageStore])

    useEffect(() => {
        if (messages.length > 0 && !visibleMessage) {
            setVisibleMessage(messages[0]);
            startTimer();
        }
    }, [messages, visibleMessage]);

    const startTimer = () => {
        setProgress(0);
        const duration = 2000;

        timeoutRef.current = setTimeout(() => {
            removeMessage();
        }, duration);

        progressRef.current = setInterval(() => {
            setProgress((prev) => {
              const newProgress = (prev + 100 / duration * 100);
              if (newProgress >= 100) {
                clearInterval(progressRef.current!);
                return 100;
              }
              return newProgress;
            });
          }, 100);
    };

    const removeMessage = () => {
        setMessages((prev) => prev.slice(1));
        setVisibleMessage(null);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (progressRef.current) {
            clearInterval(progressRef.current);
          }
    };

    const handlePauseTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (progressRef.current) {
            clearInterval(progressRef.current);
          }
    };

    const handleResumeTimer = () => {
        startTimer();
    };

    const handleCloseNotification = () => {
        removeMessage();
    };

    return (
        <div className="fixed right-0 top-0 z-20">
            {visibleMessage && (
                <div
                    key={visibleMessage.id}
                    onMouseEnter={handlePauseTimer}
                    onMouseLeave={handleResumeTimer}
                    onTouchEnd={handleResumeTimer}
                    onTouchStart={handlePauseTimer}
                    className="bg-gray-800 text-white flex items-center w-fit p-4 rounded shadow-lg"
                >
                    <div
                      className="absolute top-0 left-0 w-full h-1 bg-gray-700"
                      style={{ width: `${progress}%` }}
                    />
                    <p className="text-cyan-500 font-semibold font-geistMono mr-2 ">{messages && messages.length > 1 && 'x' + messages.length}</p>
                    <p>
                        {visibleMessage.message}
                    </p>
                    <button
                        onClick={handleCloseNotification}
                        className="ml-2"
                        >
                        <IconX />
                    </button>
                </div>
            )}
        </div>
    )
}

export default Notification
