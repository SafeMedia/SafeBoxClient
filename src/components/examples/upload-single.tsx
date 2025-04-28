import { Button } from "../ui/button";
import { useState } from "react";
import { LoadingSpinner } from "../ui/loading-spinner";
import { toast } from "sonner";
import { UploadIcon } from "lucide-react";
import { uploadSong } from "@/backend/uploading";
import { generateLocation } from "@/lib/utils/location";
import { open } from "@tauri-apps/plugin-dialog";
import { basename, dirname, extname } from "@tauri-apps/api/path";
import { getFileNameWithoutExtension } from "@/lib/utils/extensions";

export default function UploadSingle() {
    const [isLoading, setIsLoading] = useState(false);
    const [fileInfo, setFileInfo] = useState<{
        fileName: string;
        extension: string;
        folderPath: string;
    } | null>(null);

    const handleSelectFile = async () => {
        const path = await open({
            multiple: false,
        });

        if (typeof path === "string") {
            const fileName = await basename(path);
            const extension = await extname(path);
            const folderPath = await dirname(path);

            setFileInfo({ fileName, extension, folderPath });
        }
    };

    const handleUpload = async () => {
        if (!fileInfo) return;
        setIsLoading(true);

        try {
            const result = await uploadSong(
                generateLocation(
                    getFileNameWithoutExtension(fileInfo.fileName),
                    fileInfo.extension,
                    fileInfo.folderPath
                )
            );

            if (result.error) {
                toast(result.error.title, {
                    description: result.error.description,
                });
            }
        } catch (error) {
            toast("Upload Failed", {
                description: `Something went wrong`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex p-4">
                <Button onClick={handleSelectFile} className="rounded-r-none">
                    Select
                </Button>

                <input
                    type="text"
                    readOnly
                    value={fileInfo?.fileName || "No file selected"}
                    placeholder="No file selected"
                    className="w-full rounded-r-md border border-input px-3 text-sm"
                />

                <Button
                    className="ml-2"
                    disabled={isLoading || !fileInfo}
                    onClick={async () => {
                        handleUpload();
                    }}
                >
                    {isLoading ? (
                        <>
                            Uploading... <LoadingSpinner />
                        </>
                    ) : (
                        <>
                            Upload <UploadIcon />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
