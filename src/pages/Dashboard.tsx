import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import styles from "../styles/Dashboard.module.css";

const Dashboard: React.FC = () => {
  return (
    <div className={`${styles.dashboardRoot} dashboard-container`}>
      <header className={`${styles.dashboardHeader} dashboard-header`}>
        <h1 className={`${styles.dashboardTitle} brand-text`}>Dashboard</h1>
      </header>

      <section className={`${styles.dashboardContent} main-content`}>
        {/* Tile grid for modules */}
        <div className="tiles-grid">
          <Link className="tile-card tile-blue" to="conversation">
            Conversation
          </Link>
          <Link className="tile-card tile-green" to="teaching">
            Teaching
          </Link>
          <Link className="tile-card tile-purple" to="qrscanner">
            QRScanner
          </Link>
          <Link className="tile-card tile-red" to="resumeuploader">
            Mock Interview
          </Link>
        </div>

        <Outlet />
      </section>
    </div>
  );
};

export default Dashboard;
