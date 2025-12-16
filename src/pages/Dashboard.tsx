import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import styles from "../styles/Dashboard.module.css";

const Dashboard: React.FC = () => {
  return (
    <div className={styles.dashboardRoot}>
      <header className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>Dashboard</h1>

        <nav className={styles.dashboardNav}>
          <Link className={styles.navLink} to="conversation">
            Conversation
          </Link>
          <Link className={styles.navLink} to="teaching">
            Teaching
          </Link>
          <Link className={styles.navLink} to="qrscanner">
            QrScanner
          </Link>
        </nav>
      </header>

      <section className={styles.dashboardContent}>
        <Outlet />
      </section>
    </div>
  );
};

export default Dashboard;
