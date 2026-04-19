import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Search, Plus, Filter } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    
    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [newOrder, setNewOrder] = useState({
        customerName: '',
        phoneNumber: '',
        garments: [{ type: '', quantity: 1, pricePerItem: 0 }]
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            let url = '/orders?';
            if (search) url += `search=${search}&`;
            if (statusFilter) url += `status=${statusFilter}`;
            
            const { data } = await api.get(url);
            setOrders(data);
        } catch (error) {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [search, statusFilter]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            await api.put(`/orders/${id}/status`, { status: newStatus });
            toast.success('Status updated');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleGarmentChange = (index, field, value) => {
        const updatedGarments = [...newOrder.garments];
        updatedGarments[index][field] = value;
        setNewOrder({ ...newOrder, garments: updatedGarments });
    };

    const addGarmentRow = () => {
        setNewOrder({
            ...newOrder,
            garments: [...newOrder.garments, { type: '', quantity: 1, pricePerItem: 0 }]
        });
    };

    const removeGarmentRow = (index) => {
        const updatedGarments = [...newOrder.garments];
        updatedGarments.splice(index, 1);
        setNewOrder({ ...newOrder, garments: updatedGarments });
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        try {
            await api.post('/orders', newOrder);
            toast.success('Order created successfully');
            setShowModal(false);
            setNewOrder({ customerName: '', phoneNumber: '', garments: [{ type: '', quantity: 1, pricePerItem: 0 }] });
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create order');
        }
    };

    return (
        <>
            <Navbar />
            <main className="container mt-8 animate-fade-in">
                <div className="flex justify-between align-center mb-8 flex-wrap gap-4">
                    <h1>Order Management</h1>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} /> New Order
                    </button>
                </div>

                <div className="glass-card mb-8 flex gap-4 flex-wrap align-center justify-between">
                    <div className="flex gap-4 flex-grow" style={{ maxWidth: '600px' }}>
                        <div style={{ position: 'relative', flexGrow: 1 }}>
                            <Search size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
                            <input 
                                type="text" 
                                className="form-input" 
                                placeholder="Search by name or phone..." 
                                style={{ paddingLeft: '2.5rem' }}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div style={{ position: 'relative', minWidth: '150px' }}>
                            <Filter size={18} style={{ position: 'absolute', top: '12px', left: '12px', color: 'var(--text-secondary)' }} />
                            <select 
                                className="form-input" 
                                style={{ paddingLeft: '2.5rem', appearance: 'none' }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="RECEIVED">Received</option>
                                <option value="PROCESSING">Processing</option>
                                <option value="READY">Ready</option>
                                <option value="DELIVERED">Delivered</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? <p>Loading orders...</p> : (
                    <div className="grid gap-4">
                        {orders.length === 0 ? <p className="text-center" style={{ color: 'var(--text-secondary)' }}>No orders found.</p> : null}
                        {orders.map(order => (
                            <div key={order._id} className="glass-card flex justify-between align-center flex-wrap gap-4">
                                <div>
                                    <div className="flex align-center gap-4 mb-2">
                                        <h3 style={{ margin: 0 }}>{order.customerName}</h3>
                                        <span className={`badge status-${order.status}`}>{order.status}</span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                                        Order ID: <strong style={{ color: 'var(--text-primary)' }}>{order.orderId}</strong> | Phone: {order.phoneNumber}
                                    </p>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                        Delivery Estimate: {new Date(order.estimatedDeliveryDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right flex align-center gap-6">
                                    <div>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>Total Bill</p>
                                        <h3 style={{ margin: 0, color: 'var(--success)' }}>${order.totalBill.toFixed(2)}</h3>
                                    </div>
                                    <select 
                                        className="form-input" 
                                        style={{ width: '140px', padding: '0.5rem', background: 'rgba(0,0,0,0.3)' }}
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    >
                                        <option value="RECEIVED">Received</option>
                                        <option value="PROCESSING">Processing</option>
                                        <option value="READY">Ready</option>
                                        <option value="DELIVERED">Delivered</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Order Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 className="mb-6">Create New Order</h2>
                        <form onSubmit={handleCreateOrder}>
                            <div className="grid gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
                                <div className="form-group">
                                    <label className="form-label">Customer Name</label>
                                    <input type="text" className="form-input" required value={newOrder.customerName} onChange={e => setNewOrder({...newOrder, customerName: e.target.value})} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <input type="text" className="form-input" required value={newOrder.phoneNumber} onChange={e => setNewOrder({...newOrder, phoneNumber: e.target.value})} />
                                </div>
                            </div>

                            <h3 className="mt-4 mb-4" style={{ fontSize: '1.2rem' }}>Garments</h3>
                            {newOrder.garments.map((g, index) => (
                                <div key={index} className="flex gap-4 mb-4 align-center">
                                    <input type="text" placeholder="Type (e.g. Shirt)" className="form-input" required value={g.type} onChange={e => handleGarmentChange(index, 'type', e.target.value)} style={{ flex: 2 }} />
                                    <input type="number" placeholder="Qty" className="form-input" required min="1" value={g.quantity} onChange={e => handleGarmentChange(index, 'quantity', Number(e.target.value))} style={{ flex: 1 }} />
                                    <input type="number" placeholder="Price ($)" className="form-input" required min="0" step="0.01" value={g.pricePerItem} onChange={e => handleGarmentChange(index, 'pricePerItem', Number(e.target.value))} style={{ flex: 1 }} />
                                    {index > 0 && <button type="button" onClick={() => removeGarmentRow(index)} className="btn btn-outline" style={{ padding: '0.5rem', color: 'var(--danger)', borderColor: 'var(--danger)' }}>X</button>}
                                </div>
                            ))}
                            
                            <button type="button" className="btn btn-outline mb-8" style={{ width: '100%', borderStyle: 'dashed' }} onClick={addGarmentRow}>
                                + Add Another Garment
                            </button>

                            <div className="flex justify-between mt-4">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Create Order</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Orders;
