import { Routes, Route } from "react-router";
import "./App.css";
import WalletSetupPage from "./pages/WalletSetUpPage";
import { Layout } from "./Layout";
import { CreateWalletPage } from "./pages/CreateWalletPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/wallet-setup" element={<WalletSetupPage />} />
        <Route path="/create-wallet" element={<CreateWalletPage />} />
        <Route element={<Layout />}>
          {/* <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/import-wallet" element={<ImportWalletPage />} />
          <Route
            path="/send"
            element={
              <ProtectedRoute>
                <SendPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/receive"
            element={
              <ProtectedRoute>
                <ReceivePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
