'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [piUser, setPiUser] = useState(null);
    const [logStatus, setLogStatus] = useState("Ready for Pi Network integration...");

    const [products, setProducts] = useState([
        { id: 1, title: "Modern Sofa", price: 150, category: "Living Room", image: "" },
        { id: 2, title: "Classic Wardrobe", price: 450, category: "Bedroom", image: "" },
        { id: 3, title: "Dining Table Set", price: 95, category: "Kitchen", image: "" }
    ]);

    useEffect(() => {
        const cookies = document.cookie.split(';');
        const hasToken = cookies.some(cookie => cookie.trim().startsWith('admin_token='));
        if (!hasToken) {
            router.push('/admin');
            return;
        }

        if (window.Pi) {
            try {
                window.Pi.init({ version: "2.0", sandbox: true });
                setLogStatus("Pi SDK initialized successfully (Sandbox Mode)");
            } catch (err) {
                setLogStatus(`SDK Init Failed: ${err.message}`);
            }
        } else {
            setLogStatus("Warning: Pi SDK not found. Please open inside Pi Browser.");
        }
    }, [router]);

    const authenticatePi = async () => {
        if (!window.Pi) {
            alert("Please open this app inside the Pi Browser.");
            return;
        }
        setLogStatus("Authenticating with Pi Network...");
        try {
            const scopes = ['username', 'payments', 'wallet_address'];
            
            function onIncompletePaymentFound(payment) {
                setLogStatus(`Incomplete payment found: ${payment.identifier}`);
            }

            const auth = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
            setPiUser(auth.user.username);
            setLogStatus(`Connected successfully as: ${auth.user.username}`);
        } catch (error) {
            setLogStatus(`Authentication Error: ${error.message}`);
        }
    };

    const handlePurchase = async (product) => {
        if (!window.Pi) {
            alert("Please use Pi Browser to complete payments.");
            return;
        }
        setLogStatus(`Initiating payment for: ${product.title}...`);
        try {
            const paymentData = {
                amount: product.price,
                memo: `Purchase ${product.title} from Tamco Furniture`,
                metadata: { productId: product.id }
            };

            const paymentCallbacks = {
                onReadyForServerApproval: (paymentId) => {
                    setLogStatus(`Payment ready for server approval. ID: ${paymentId}`);
                },
                onReadyForServerCompletion: (paymentId, txid) => {
                    setLogStatus(`Transaction signed! Blockchain TXID: ${txid}`);
                    alert(`Success! Purchased ${product.title}.`);
                },
                onCancel: (paymentId) => {
                    setLogStatus("Payment cancelled by user.");
                },
                onError: (error, payment) => {
                    setLogStatus(`Payment Error: ${error.message}`);
                }
            };

            await window.Pi.createPayment(paymentData, paymentCallbacks);
        } catch (error) {
            setLogStatus(`Payment Trigger Failed: ${error.message}`);
        }
    };

    const handleLogout = () => {
        document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push('/admin');
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.logo}>TAMCO FURNITURE - Dashboard</h2>
                <div>
                    <button onClick={authenticatePi} style={styles.piBtn}>
                        {piUser ? `Connected: ${piUser}` : "Connect Pi Wallet"}
                    </button>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </header>

            <div style={styles.content}>
                <h3 style={{ color: '#ffb300', marginBottom: '10px' }}>Furniture Inventory (Pi Sandbox)</h3>
                
                <div style={styles.statusBar}>
                    <strong>System Status:</strong> {logStatus}
                </div>
                
                <div style={styles.grid}>
                    {products.map((p) => (
                        <div key={p.id} style={styles.productCard}>
                            <div style={styles.placeholderImg}>No Image</div>
                            <h4 style={styles.productTitle}>{p.title}</h4>
                            <p style={styles.productMeta}><strong>Category:</strong> {p.category}</p>
                            <p style={styles.productPrice}><strong>Price:</strong> {p.price} Pi</p>
                            <button onClick={() => handlePurchase(p)} style={styles.buyBtn}>
                                Pay with Pi
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { background: '#121212', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif', direction: 'ltr' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e1e1e', padding: '15px 30px', borderBottom: '2px solid #ffb300' },
    logo: { color: '#ffb300', margin: 0, fontSize: '20px' },
    piBtn: { background: '#6200ee', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' },
    logoutBtn: { background: '#c62828', color: '#ffffff', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
    content: { padding: '30px' },
    statusBar: { background: '#000', color: '#00ff00', padding: '10px 15px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '13px', marginBottom: '25px', border: '1px solid #333' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
    productCard: { background: '#1e1e1e', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' },
    placeholderImg: { width: '100%', height: '150px', background: '#333', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#aaa', fontSize: '14px', marginBottom: '10px' },
    productTitle: { margin: '10px 0 5px 0', color: '#ffffff' },
    productMeta: { margin: '0 0 5px 0', fontSize: '14px', color: '#aaa' },
    productPrice: { margin: '0 0 15px 0', color: '#ffb300', fontWeight: 'bold' },
    buyBtn: { width: '100%', background: '#ffb300', color: '#000', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }
};