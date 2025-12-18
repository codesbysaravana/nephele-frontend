import React, { useState } from 'react';
import { Bell, Settings, Bot, Speech,  ScanQrCode, FileUser, BookOpen,  AudioLines, Camera} from 'lucide-react'; import GokuIcon from "./assets/GokuIcon";
import './App.css';

import Nephele from "./pages/Nephele";
import Conversation from "./pages/Conversation";
import QrScanner from "./pages/QrScanner";
//import ResumeUploader from "./pages/ResumeUploader";
import Teaching from "./pages/Teaching";
import Compere from "./pages/Compere";
import SelfieOption from "./pages/SelfieOption";
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'overview', icon: GokuIcon, label: 'Overview' },
    { id: 'conversation', icon: AudioLines, label: 'Conversation' },
    { id: 'qrscanner', icon:  ScanQrCode , label: 'QrScanner' },
    { id: 'resumeuploader', icon: FileUser, label: 'ResumeUploader' },
    { id: 'teaching', icon: BookOpen, label: 'Teaching' },
    { id: 'compere', icon: Speech, label: 'Compere' },
    { id: 'selfie', icon: Camera, label: 'SelfieOption' },

    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'conversation': return <Conversation />;
      case 'qrscanner': return <QrScanner />;
      case 'resumeuploader': return <Compere />; /* change to ResumeUplaoder */
      case 'teaching': return <Teaching />;

      //about to implement
      case 'compere': return <Compere />;
      case 'selfie': return <SelfieOption />;
      case 'reports': return <Reports />;

      //must change
      case 'notifications': return <Notifications />;
      case 'settings': return <SettingsComponent />;
      default: return <Nephele />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon"><Bot size={32} color="black" /></div>
            {sidebarOpen && <span className="logo-text">Nephele 3.0</span>}
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${sidebarOpen ? 'nav-item-open' : 'nav-item-closed'} ${activeTab === item.id ? 'active' : ''}`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <Icon className="nav-icon" size={20} />
                {sidebarOpen && <span className="nav-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${sidebarOpen ? 'main-open' : 'main-closed'}`}>
        <header className="header">
          <div className="header-inner">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="menu-toggle">
              ☰
            </button>
            <div className="header-right">
              <div className="date-box">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
              <div className="user-info">
                <div className="user-avatar">SP</div>
                <span className="user-name">Saravana Priyan</span>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

// ===================== CHILD COMPONENTS ===================== //

const Reports = () => {
  const orders = [
    { id: '#1234', customer: 'John Doe', amount: '$159.99', status: 'delivered' },
    { id: '#1235', customer: 'Jane Smith', amount: '$89.50', status: 'processing' },
    { id: '#1236', customer: 'Mike Johnson', amount: '$299.00', status: 'pending' },
    { id: '#1237', customer: 'Sarah Wilson', amount: '$45.25', status: 'delivered' },
  ];

  return (
    <div className="space-y">
      <h1 className="heading">Orders</h1>
      <div className="card glass fade-in">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="table-row">
                  <td className="font-bold">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`badge ${order.status==='delivered'?'status-active':order.status==='processing'?'status-processing':'status-pending'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


const Notifications = () => {
  const orders = [
    { id: '#1234', customer: 'John Doe', amount: '$159.99', status: 'delivered' },
    { id: '#1235', customer: 'Jane Smith', amount: '$89.50', status: 'processing' },
    { id: '#1236', customer: 'Mike Johnson', amount: '$299.00', status: 'pending' },
    { id: '#1237', customer: 'Sarah Wilson', amount: '$45.25', status: 'delivered' },
  ];

  return (
    <div className="space-y">
      <h1 className="heading">Orders</h1>
      <div className="card glass fade-in">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="table-row">
                  <td className="font-bold">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`badge ${order.status==='delivered'?'status-active':order.status==='processing'?'status-processing':'status-pending'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SettingsComponent = () => {
  const orders = [
    { id: '#1234', customer: 'John Doe', amount: '$159.99', status: 'delivered' },
    { id: '#1235', customer: 'Jane Smith', amount: '$89.50', status: 'processing' },
    { id: '#1236', customer: 'Mike Johnson', amount: '$299.00', status: 'pending' },
    { id: '#1237', customer: 'Sarah Wilson', amount: '$45.25', status: 'delivered' },
  ];

  return (
    <div className="space-y">
      <h1 className="heading">Orders</h1>
      <div className="card glass fade-in">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={idx} className="table-row">
                  <td className="font-bold">{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`badge ${order.status==='delivered'?'status-active':order.status==='processing'?'status-processing':'status-pending'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



export default App;
