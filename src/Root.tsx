import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import App from './App';

const Root = () => {
  return (
    <Routes>
      {/* Landing page */}
      <Route
        path="/"
        element={
          <Landing
            src="/videos/nepheletrimmed.mp4"
            navigateTo="/app"
          />
        }
      />

      {/* Main dashboard */}
      <Route path="/app/*" element={<App />} />
    </Routes>
  );
};

export default Root;
