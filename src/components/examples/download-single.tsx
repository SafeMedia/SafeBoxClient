import { download } from "@/backend/logic";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { isValidXorname } from "@/lib/utils/validation";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { LoadingSpinner } from "../ui/loading-spinner";
import { toast } from "sonner";

export default function DownloadSingle() {
    const [xorname, setXorname] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setXorname(value);
    };

    const handleDownload = async () => {
        setIsLoading(true);

        try {
            await download(xorname, xorname);
        } catch (error) {
            console.error("Download failed:", error);
            toast("Download Failed", {
                description: `Failed to download: ${xorname}`,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="flex p-4 space-x-2">
                <Input
                    type="text"
                    placeholder="Enter xorname"
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    value={xorname}
                    onChange={handleInputChange}
                    disabled={isLoading}
                />
                <Button
                    disabled={!isValidXorname(xorname) || isLoading}
                    onClick={async () => {
                        handleDownload();
                    }}
                >
                    {isLoading ? (
                        <>
                            Downloading... <LoadingSpinner />
                        </>
                    ) : (
                        <>
                            Download <MagnifyingGlassIcon />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
