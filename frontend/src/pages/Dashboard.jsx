import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Package, DollarSign, CheckCircle, Clock, Truck, Inbox } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalRevenue: 0,
        statusCounts: {
            RECEIVED: 0,
            PROCESSING: 0,
            READY: 0,
            DELIVERED: 0
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/dashboard');
                setStats(data);
            } catch (error) {
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const statCards = [
        { title: 'Total Orders', value: stats.totalOrders, icon: <Package size={24} color="#3b82f6" />, color: 'rgba(59, 130, 246, 0.1)' },
        { title: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, icon: <DollarSign size={24} color="#10b981" />, color: 'rgba(16, 185, 129, 0.1)' },
    ];

    const statusCards = [
        { title: 'Received', value: stats.statusCounts.RECEIVED, icon: <Inbox size={24} color="#60a5fa" />, color: 'var(--glass-bg)' },
        { title: 'Processing', value: stats.statusCounts.PROCESSING, icon: <Clock size={24} color="#fbbf24" />, color: 'var(--glass-bg)' },
        { title: 'Ready', value: stats.statusCounts.READY, icon: <CheckCircle size={24} color="#34d399" />, color: 'var(--glass-bg)' },
        { title: 'Delivered', value: stats.statusCounts.DELIVERED, icon: <Truck size={24} color="#9ca3af" />, color: 'var(--glass-bg)' },
    ];

    return (
        <>
            <Navbar />
            <main className="container mt-8 animate-fade-in">
                <h1 className="mb-8">Dashboard Overview</h1>
                
                {loading ? (
                    <p>Loading dashboard...</p>
                ) : (
                    <>
                        <div className="grid gap-6 mb-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                            {statCards.map((card, idx) => (
                                <div key={idx} className="glass-card flex align-center" style={{ background: card.color }}>
                                    <div style={{ marginRight: '1rem', background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px' }}>
                                        {card.icon}
                                    </div>
                                    <div>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{card.title}</p>
                                        <h2 style={{ fontSize: '1.8rem', marginTop: '0.2rem' }}>{card.value}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h2 className="mb-4" style={{ fontSize: '1.4rem' }}>Order Status</h2>
                        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                            {statusCards.map((card, idx) => (
                                <div key={idx} className="glass-card text-center" style={{ background: card.color }}>
                                    <div style={{ display: 'inline-block', marginBottom: '0.5rem' }}>{card.icon}</div>
                                    <h3 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>{card.value}</h3>
                                    <p style={{ color: 'var(--text-secondary)' }}>{card.title}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default Dashboard;
