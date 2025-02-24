import { Routes, Route } from "react-router";
import "./App.css";
import { Layout } from "./Layout";
import { CreateWalletPage } from "./pages/CreateWalletPage";
import AuthPage from "./pages/AuthPage";
import { WalletProvider } from "@/context/WalletProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import WalletSetupPage from "./pages/WalletSetUpPage";
import WalletFromMnemonic from "./pages/WalletFromMnemonic";
import { DashBoard } from "./pages/DashBoard";
import Test from "./pages/test";
import ImportWalletPage from "./pages/ImportWalletPage";
// import HomePage from "./pages/HomePage";
// import ImportWalletPage from "./pages/ImportWalletPage";
// import SendPage from "./pages/SendPage";
// import ReceivePage from "./pages/ReceivePage";
// import SettingsPage from "./pages/SettingsPage";
// import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <WalletProvider>
      <Routes>
        <Route path="/test" element={<Test />} />
        <Route element={<Layout />}>
          <Route path="/wallet-setup" element={<WalletSetupPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/create-wallet" element={<CreateWalletPage />} />
          <Route path="/wfm" element={<WalletFromMnemonic />} />
          <Route path="/import-wallet" element={<ImportWalletPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/send"
            element={
              <ProtectedRoute>
                <div>Send</div>
                {/* <SendPage /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/receive"
            element={
              <ProtectedRoute>
                <div>Receive</div>
                {/* <ReceivePage /> */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <div>Settings</div>
                {/*
                  <SettingsPage />
                  */}
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </WalletProvider>
  );
}

export default App;
