import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LandingVideo from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Conversation from "./pages/Conversation";
import Teaching from "./pages/Teaching";
import QrScanner from "./pages/QrScanner";

import robotEyes from './assets/nepheletrimmed.mp4';

import styles from "./App.module.css";
import "./index.css";

function App() {
  return (
    <Router>
      <div className={styles.appRoot}>
        <Routes>
          <Route
            path="/"
            element={
              <div className={styles.pageFrame}>
                <LandingVideo
                  src={robotEyes}
                  navigateTo="/dashboard"
                />
              </div>
            }
          />
          <Route
            path="/dashboard"
            element={
              <div className={styles.pageFrame}>
                <Dashboard />
              </div>
            }
          >
            <Route path="conversation" element={<Conversation />} />
            <Route path="teaching" element={<Teaching />} />
            <Route path="qrscanner" element={<QrScanner />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
