import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard";
import Settings from "./pages/settings";
import StatusSettings from "./components/settings/status-settings";
import StorageSettings from "./components/settings/storage-settings";
import NotificationSettings from "./components/settings/notification-settings";
import PreferenceSettings from "./components/settings/preference-settings";
import NetworkSettings from "./components/settings/network-settings";
import DownloadSingle from "./components/examples/download-single";
import UploadSingle from "./components/examples/upload-single";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="download-single" element={<DownloadSingle />} />
            <Route path="upload-single" element={<UploadSingle />} />

            <Route path="/settings/*" element={<Settings />}>
                <Route path="status" element={<StatusSettings />} />
                <Route path="storage" element={<StorageSettings />} />
                <Route
                    path="notifications"
                    element={<NotificationSettings />}
                />
                <Route path="preference" element={<PreferenceSettings />} />
                <Route path="network" element={<NetworkSettings />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
