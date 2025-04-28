import { useEffect } from "react";
import { toast } from "sonner";
import { listen } from "@tauri-apps/api/event";

export default function Dashboard() {
    useEffect(() => {
        const unlistenDownload = listen<string>("download-file", (event) => {
            toast("Download Request", {
                description: event.payload,
            });
            // TODO trigger download of this file now
        });

        const unlistenUpload = listen<string>("upload-file", (event) => {
            toast("Upload Request", {
                description: event.payload,
            });
            // TODO trigger upload of this file now
        });

        return () => {
            unlistenDownload.then((fn) => fn());
            unlistenUpload.then((fn) => fn());
        };
    }, []);

    return (
        <div className="p-4 space-y-2">
            <div className="flex flex-row"></div>
        </div>
    );
}
