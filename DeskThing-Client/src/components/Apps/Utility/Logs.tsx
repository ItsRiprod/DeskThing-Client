import { useState } from "react";
import { log, LOG_TYPES, LogStore } from "../../../stores";
import Button from "../../Button";

interface UtilLogsInterface {
    onBack: () => void
}

const UtilLogs: React.FC<UtilLogsInterface> = ({ onBack }) => {
    const logStore = LogStore.getInstance()
    const [logs, setLogs] = useState<log[]>(logStore.getAllLogs() || [])
    const [logFilter, setLogFilter] = useState<LOG_TYPES | 'all'>('all');

    const clearLogs = () => {
        logStore.clearLogs();
        setLogs([]);
    }

    const filterLogs = (type: LOG_TYPES | 'all') => {
        setLogFilter(type);
    }

    return (
        <div className="w-full">
                        <Button className="my-2 bg-zinc-900 w-fit" onClick={onBack}>{'<-'} Go Back</Button>

            <div className="w-full flex justify-between mb-3">
                <button
                    className={`border-2 border-slate-500 rounded-xl p-5`}
                    onClick={clearLogs}
                >
                    <p>Clear Logs</p>
                </button>
                <button
                    className={`${logFilter == "log" ? "bg-slate-800 border-green-500" : "border-slate-500"} border-2 rounded-xl p-5`}
                    onClick={() => filterLogs("log")}
                >
                    <p>Logs</p>
                </button>
                <button
                    className={`${logFilter == "error" ? "bg-slate-800 border-green-500" : "border-slate-500"} border-2 rounded-xl p-5`}
                    onClick={() => filterLogs("error")}
                >
                    <p>Errors</p>
                </button>
                <button
                    className={`${logFilter == "message" ? "bg-slate-800 border-green-500" : "border-slate-500"} border-2 rounded-xl p-5`}
                    onClick={() => filterLogs("message")}
                >
                    <p>Messages</p>
                </button>
                <button
                    className={`${logFilter == "all" ? "bg-slate-800 border-green-500" : "border-slate-500"} border-2 rounded-xl p-5`}
                    onClick={() => filterLogs("all")}
                >
                    <p>All</p>
                </button>
            </div>
            {logs && logs.map((log, index) => (
                <div
                    key={index}
                    className={`${logFilter != "all" && log.type != logFilter && "hidden"} ${log.type == "error" && "bg-red-500"} ${log.type == "log" && "bg-slate-900"} ${log.type == "message" && "bg-slate-500"} w-full border-x-2 mb-1 rounded-2xl h-fit overflow-hidden hover:overflow-fit`}
                >
                    <p className="p-5">
                        {log.app}:{" " + log.payload}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default UtilLogs;
