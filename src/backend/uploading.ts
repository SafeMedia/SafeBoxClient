import { uploadFile } from "@/backend/autonomi";
import { Errors } from "@/enums/errors";

export async function uploadSong(filePath: string): Promise<{
    success: boolean;
    songXorname?: string;
    error?: { title: string; description: string };
}> {
    try {
        const songXorname = await uploadFile(filePath);
        if (songXorname) {
            return { success: true, songXorname };
        } else {
            return { success: false };
        }
    } catch (e: any) {
        const errorMessage = e.Common?.toLowerCase().trim().replace(/\.$/, ""); // converts to lowercase and remove trailing period

        if (errorMessage?.includes("error occurred during payment")) {
            return { success: false, error: Errors.PaymentRequired };
        } else if (errorMessage?.includes("safe: notloggedin")) {
            return { success: false, error: Errors.NotLoggedIn };
        } else {
            return { success: false, error: Errors.UnknownError };
        }
    }
}
