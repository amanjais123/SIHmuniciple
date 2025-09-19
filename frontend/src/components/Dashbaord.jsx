import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// ✅ Import leaflet icons fix
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon issue in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const wasteTypes = [
  { type: 'Bio Degradable', value: 61 },
  { type: 'Non Bio Degradable', value: 39 },
];

const collectionTrends = [
  { date: 'Mon', filled: 32 },
  { date: 'Tue', filled: 43 },
  { date: 'Wed', filled: 51 },
  { date: 'Thu', filled: 48 },
  { date: 'Fri', filled: 54 },
  { date: 'Sat', filled: 0 }
];

function ArrowIcon({ open }) {
  return (
    <span style={{ display: 'inline-block', transition: 'transform 0.2s', marginLeft: 8, transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}>
      <svg width="16" height="16" viewBox="0 0 24 24">
        <polyline points="6 9 12 15 18 9" fill="none" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

function Dashboard() {
  const [binsData, setBinsData] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [loading, setLoading] = useState(true);

  const sampleBins = [
    { _id: "BIN001", Id: "BIN001", Location: "MMMUT MAIN GATE", lat: 26.7298, lng: 83.4313},
    { _id: "BIN002", Id: "BIN002", Location: "MMMUT LIBRARY", lat: 26.7303, lng:83.43302},
    { _id: "BIN003", Id: "BIN003", Location: "MMMUT MPH", lat: 26.7318, lng: 83.4342 },
  ];

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
        const res = await axios.get(`${API_URL}/api/bins`);
        setBinsData(res.data.data);
      } catch (err) {
        console.error('Error fetching bins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBins();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #20242D 60%, #171923 100%)', color: '#EEE', fontFamily: 'Poppins, Arial, sans-serif' }}>
      {/* Header */}
      <header style={{ background: '#16181f', color: '#FFF', padding: 28, fontSize: '2.2rem', fontWeight: 'bold', textAlign: 'center', letterSpacing: '0.1em', boxShadow: '0 2px 16px #1114' }}>
        GORAKHPUR DEVELOPMENT AUTHORITY
        <h2>Bin Monitoring System</h2>
      </header>

      {/* Main Layout */}
      <div style={{ display: 'flex', gap: 32, padding: '32px', flexDirection: 'row', alignItems: 'flex-start' }}>
        {/* Left Panel: Bin List */}
        <div style={{ width: '40%', background: 'rgba(30,34,44,0.98)', borderRadius: 20, boxShadow: '0 2px 18px #222a', padding: 28, minHeight: '600px' }}>
          <h2 style={{ marginBottom: 18, fontWeight: 600, color: '#FF8C00' }}>All Bins</h2>
          {loading ? (
            <p>Loading bins...</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {binsData.map(bin => {
                const open = selectedBin === bin._id;
                return (
                  <li key={bin._id} style={{ marginBottom: 20 }}>
                    <button
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 16,
                        background: open ? '#23283b' : '#242631',
                        border: 'none',
                        borderRadius: 12,
                        fontWeight: 600,
                        fontSize: 18,
                        color: 'inherit',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: open ? '0 2px 18px #ff8c0044' : undefined,
                        transition: 'background 0.25s'
                      }}
                      onClick={() => setSelectedBin(open ? null : bin._id)}
                    >
                      <span>{bin.Id} — {open ? (bin.IsFull ? "Full" : "Not Full") : bin.Location}</span>
                      <ArrowIcon open={open} />
                    </button>
                    {open && (
                      <div style={{ background: 'rgba(24,25,38,0.98)', marginTop: 5, borderRadius: 9, padding: 18, boxShadow: '0 1px 10px #16181f77', fontSize: 16 }}>
                        <div style={{ marginBottom: 8 }}><strong style={{ color: '#FF8C00'}}>Status:</strong> {bin.IsFull ? "Full" : "Not Full"}</div>
                        <div style={{ marginBottom: 8 }}><strong style={{ color: '#FF8C00'}}>Location:</strong> {bin.Location}</div>
                        <div style={{ marginBottom: 8 }}><strong style={{ color: '#FF8C00'}}>Last Emptied:</strong> N/A</div>
                        <div><strong style={{ color: '#FF8C00'}}>Fill Level:</strong> {bin.FillLevel}%</div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Right Panel: Charts + Map */}
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Charts Row */}
          <div style={{ display: 'flex', gap: 28 }}>
            {/* Pie Chart */}
            <div style={{ background: 'rgba(30,34,44,0.98)', borderRadius: 20, boxShadow: '0 2px 18px #222a', padding: 28, flex: 1 }}>
              <h3 style={{ marginBottom: 22, color: '#FF8C00', fontWeight: 500 }}>Waste Composition</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <defs>
                    <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#FFB74D" stopOpacity={0.9} />
                    </linearGradient>
                    <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#80CBC4" stopOpacity={0.9} />
                    </linearGradient>
                  </defs>
                  <Pie data={wasteTypes} cx="50%" cy="50%" innerRadius={60} outerRadius={100} fill="url(#grad1)" dataKey="value" label={({ percent }) => `${(percent*100).toFixed(0)}%`} labelLine={false}>
                    {wasteTypes.map((entry, index) => <Cell key={`cell-${index}`} fill={`url(#grad${index+1})`} />)}
                  </Pie>
                  <Tooltip formatter={(val,name,props)=>[`${val}%`, props.payload.type]} contentStyle={{ background: '#1e1f29', border: '1px solid #FF8C00', borderRadius: 8, color: '#EEE' }} />
                  <Legend wrapperStyle={{ color:'#EEE' }} verticalAlign="bottom"/>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div style={{ background: 'rgba(30,34,44,0.98)', borderRadius: 20, boxShadow: '0 2px 18px #222a', padding: 28, flex: 1 }}>
              <h3 style={{ marginBottom: 22, color: '#FF8C00', fontWeight: 500 }}>Weekly Fill Levels</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={collectionTrends}>
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.9} />
                      <stop offset="95%" stopColor="#FFB74D" stopOpacity={0.7} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#EEE" />
                  <YAxis stroke="#EEE" />
                  <Tooltip formatter={(val)=>[`${val}%`, 'Fill Level']} contentStyle={{ background: '#1e1f29', border: '1px solid #FF8C00', borderRadius: 8, color: '#EEE' }} />
                  <Legend wrapperStyle={{ color:'#EEE' }} />
                  <Bar dataKey="filled" fill="url(#barGrad)" barSize={40} radius={[6,6,0,0]} isAnimationActive/>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Map Panel */}
          <div style={{ background: 'rgba(30,34,44,0.98)', borderRadius: 20, boxShadow: '0 2px 18px #222a', padding: 28, width: '100%', minHeight: 400 }}>
            <h3 style={{ marginBottom: 22, color: '#FF8C00', fontWeight: 500 }}>Dustbin Locations</h3>
            <MapContainer center={[26.727364,  83.433271]} zoom={14} style={{ height: '350px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
              {sampleBins.map(bin => (
                <Marker key={bin._id} position={[bin.lat, bin.lng]}>
                  <Popup>{bin.Id} — {bin.Location}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
