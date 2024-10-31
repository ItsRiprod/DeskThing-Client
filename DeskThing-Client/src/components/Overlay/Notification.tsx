import React, { useEffect, useState, useRef } from "react"
import { log, LogStore } from "../../stores"
import { IconX } from "../../assets/Icons"

type logData = {
    log: log,
    id: number
}

const Notification: React.FC = () => {
    const logStore = LogStore.getInstance()
    const [messages, setMessages] = useState<logData[]>([])
    const [visibleMessage, setVisibleMessage] = useState<logData | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const progressRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleLog = (log: log) => {
            if (log.type === 'log') return
            setMessages((oldData) => [
                ...oldData,
                { log: log, id: Date.now() }
            ])
        }

        const listener = logStore.on('all', handleLog)

        return () => {
            listener()
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (progressRef.current) {
                clearInterval(progressRef.current);
              }
        }
    }, [logStore])

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
                    className={`${visibleMessage.log.type == 'log' ? 'bg-zinc-900' : visibleMessage.log.type == 'message' ? 'bg-zinc-900' : 'bg-red-900'} text-white flex items-center w-fit p-4 rounded shadow-lg`}
                >
                    <div
                      className="absolute top-0 left-0 w-full h-1 bg-zinc-700"
                      style={{ width: `${progress}%` }}
                    />
                    <p className={`${visibleMessage.log.type == 'log' ? 'text-cyan-500' : visibleMessage.log.type == 'message' ? 'text-cyan-500' : 'text-white'} font-semibold font-geistMono mr-2 `}>{messages && messages.length > 1 && 'x' + messages.length}</p>
                    <p>
                        {visibleMessage.log.payload}
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
