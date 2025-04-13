import { download } from "@/backend/logic";
import { Button } from "./ui/button";

export default function Examples() {
    return (
        <div className="p-4 space-y-2">
            <div className="flex flex-row">
                <Button
                    onClick={async () => {
                        download(
                            "2ba2928fb9c93c8d597dc0a1d9277eeedab25c8fa3a76c1ae0dfe6518a1723e9",
                            "filename"
                        );
                    }}
                >
                    Download File
                </Button>
            </div>
        </div>
    );
}
