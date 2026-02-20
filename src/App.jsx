import React, { useState } from 'react';
import { MapPin, X, Navigation, Beaker, Info, Utensils, Trees, Trophy } from 'lucide-react';
import { calculatePath } from './utils/navigation';

const App = () => {
    const [selectedStall, setSelectedStall] = useState(null);
    const [showPath, setShowPath] = useState(true);
    const [isLegendOpen, setIsLegendOpen] = useState(false);

    // Layout Constants - matching original map.js coordinates
    const islandCenter = { x: 440, y: 260 };
    const radius = 80;
    const vRoad1X = 270;
    const vRoad2X = 580;

    // Stall Data - evenly distributed around island
    const stallData = [
        { title: 'Quantum Computing', desc: 'Superconducting circuits and qubits demonstration.' },
        { title: 'Renewable Systems', desc: 'Solar tracking and wind turbine optimization.' },
        { title: 'Bio-Genetics', desc: 'CRISPR-Cas9 visualization and DNA extraction.' },
        { title: 'Robotics & AI', desc: 'Autonomous rover on simulated Martian terrain.' },
        { title: 'Astro-Physics', desc: 'Solar telescope and deep-space imaging.' },
        { title: 'Marine Biology', desc: 'Coral reef restoration and ecosystem sensors.' },
        { title: 'Structural Eng.', desc: 'Bridge stress-testing and seismic builds.' },
        { title: 'Nano-Tech', desc: 'Carbon nanotube models and microscopy.' }
    ].map((info, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        return {
            id: i + 1,
            title: info.title,
            location: 'Island Perimeter',
            description: info.desc,
            x: Math.round(islandCenter.x + radius * Math.cos(angle)),
            y: Math.round(islandCenter.y + radius * Math.sin(angle))
        };
    });

    // Clean Building component - no blur, no broken SVG attributes
    const Building = ({ x, y, w, h, label, color = '#3b82f6', icon: Icon, tagPos = 'top' }) => (
        <g transform={`translate(${x}, ${y})`}>
            <rect width={w} height={h} x="4" y="4" fill="#94a3b8" rx="4" opacity="0.3" />
            <rect width={w} height={h} fill="white" stroke="#475569" strokeWidth="2" rx="4" />
            <rect x="2" y="2" width={w - 4} height="6" fill={color} rx="2" />
            <g transform={tagPos === 'top' ? `translate(${w / 2}, -10)` : `translate(${w / 2}, ${h + 14})`}>
                <text textAnchor="middle" className="text-[9px] font-black fill-slate-700 uppercase tracking-wide">
                    {label}
                </text>
            </g>
            {Icon && <Icon className="opacity-10 text-slate-400" x={w / 2 - 10} y={h / 2 - 10} width={20} height={20} />}
        </g>
    );

    return (
        <div className="flex flex-col h-[100dvh] bg-slate-50 text-slate-800 overflow-hidden font-sans">
            {/* Header */}
            <header className="bg-white px-4 py-3 z-20 flex justify-between items-center border-b-2 border-slate-800 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Beaker className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm sm:text-lg font-black text-slate-900 leading-none tracking-tight">CHRIST UNIVERSITY</h1>
                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Science Exhibition Wayfinder</p>
                    </div>
                </div>
                <button
                    onClick={() => setShowPath(!showPath)}
                    className={`p-2 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black transition-colors border-2 border-slate-800 ${showPath ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
                >
                    <Navigation className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">{showPath ? 'PATH ON' : 'PATH OFF'}</span>
                </button>
            </header>

            {/* Map */}
            <div className="relative flex-1 overflow-auto bg-white w-full">
                <svg
                    viewBox="0 0 900 600"
                    className="w-full h-full min-w-[840px] md:min-w-0 block"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Background */}
                    <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="0.8" fill="#e2e8f0" />
                        </pattern>
                    </defs>
                    <rect width="900" height="600" fill="#fafafa" />
                    <rect width="900" height="600" fill="url(#grid)" />

                    {/* Green zones */}
                    <rect x="15" y="15" width={vRoad1X - 30} height="390" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" rx="6" />
                    <rect x={vRoad2X + 30} y="15" width={900 - vRoad2X - 45} height="390" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" rx="6" />

                    {/* Roads */}
                    <rect x="0" y="420" width="900" height="40" fill="#cbd5e1" rx="2" />
                    <rect x={vRoad1X} y="250" width="30" height="170" fill="#cbd5e1" />
                    <rect x={vRoad2X} y="200" width="30" height="220" fill="#cbd5e1" />
                    {/* Road center lines */}
                    <line x1="0" y1="440" x2="900" y2="440" stroke="white" strokeWidth="2" strokeDasharray="12,18" opacity="0.6" />
                    <line x1={vRoad1X + 15} y1="250" x2={vRoad1X + 15} y2="420" stroke="white" strokeWidth="2" strokeDasharray="12,18" opacity="0.6" />
                    <line x1={vRoad2X + 15} y1="200" x2={vRoad2X + 15} y2="420" stroke="white" strokeWidth="2" strokeDasharray="12,18" opacity="0.6" />
                    <text x="840" y="445" className="fill-slate-500 font-black text-[10px] uppercase tracking-wider">EXIT →</text>

                    {/* ── Bottom Row Buildings ── */}
                    <Building x={30} y={480} w={80} h={60} label="Audi Block" tagPos="bottom" color="#ec4899" />
                    <Building x={130} y={480} w={80} h={60} label="CJC" tagPos="bottom" color="#ec4899" />

                    {/* Central Block with Gourmet wing */}
                    <g transform="translate(250, 480)">
                        <rect width="140" height="70" x="4" y="4" fill="#94a3b8" rx="4" opacity="0.3" />
                        <rect width="140" height="70" fill="white" stroke="#475569" strokeWidth="2" rx="4" />
                        <rect x="2" y="2" width="80" height="6" fill="#3b82f6" rx="2" />
                        <rect x="84" y="2" width="54" height="6" fill="#f97316" rx="2" />
                        <line x1="85" y1="8" x2="85" y2="70" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,3" />
                        <text x="42" y="32" textAnchor="middle" className="text-[10px] font-black fill-slate-700 uppercase">Central</text>
                        <text x="42" y="44" textAnchor="middle" className="text-[8px] font-bold fill-slate-400 uppercase tracking-wider">Block</text>
                        <Utensils className="text-orange-400 opacity-40" x="100" y="18" width="18" height="18" />
                        <text x="110" y="52" textAnchor="middle" className="text-[8px] font-black fill-orange-500 uppercase tracking-wider">Gourmet</text>
                        <text x="70" y={-10} textAnchor="middle" className="text-[9px] font-black fill-slate-700 uppercase tracking-wide">Central Block</text>
                    </g>

                    <Building x={420} y={480} w={140} h={60} label="Ground" color="#10b981" tagPos="bottom" />
                    <Building x={590} y={480} w={100} h={60} label="Block 4" tagPos="bottom" />
                    <Building x={720} y={480} w={120} h={60} label="R&D Block" color="#9333ea" tagPos="bottom" />

                    {/* ── Top Row Buildings ── */}
                    {/* Registration Desk */}
                    <g transform="translate(40, 340)">
                        <rect width="90" height="50" x="4" y="4" fill="#991b1b" rx="4" opacity="0.4" />
                        <rect width="90" height="50" rx="4" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
                        <text x="45" y="24" textAnchor="middle" className="text-[9px] font-black fill-white uppercase">Registration</text>
                        <text x="45" y="36" textAnchor="middle" className="text-[7px] font-bold fill-white/80 uppercase tracking-wider">Desk</text>
                    </g>

                    <Building x={150} y={220} w={100} h={70} label="Basketball Court" color="#f97316" icon={Trophy} />
                    <Building x={350} y={60} w={180} h={100} label="Block 1" color="#3b82f6" />
                    <Building x={545} y={220} w={40} h={140} label="Block 2" tagPos="top" color="#6366f1" />
                    <Building x={630} y={180} w={110} h={80} label="Block 3" color="#8b5cf6" />
                    <Building x={650} y={40} w={140} h={80} label="Birds Park" color="#22c55e" icon={Trees} />

                    {/* ── Exhibition Island Hub ── */}
                    <g>
                        {/* Outer guide ring */}
                        <circle cx={islandCenter.x} cy={islandCenter.y} r={radius + 12} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
                        {/* Main ring */}
                        <circle cx={islandCenter.x} cy={islandCenter.y} r={radius} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8,4" />
                        {/* Center hub */}
                        <circle cx={islandCenter.x} cy={islandCenter.y} r="35" fill="#0f172a" />
                        <text x={islandCenter.x} y={islandCenter.y + 4} textAnchor="middle" className="text-[11px] font-black fill-white uppercase tracking-widest">Island</text>

                        {/* Stall Nodes */}
                        {stallData.map(stall => (
                            <g
                                key={stall.id}
                                className="cursor-pointer"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedStall(stall);
                                }}
                            >
                                {/* Spoke line */}
                                <line x1={islandCenter.x} y1={islandCenter.y} x2={stall.x} y2={stall.y} stroke="#e2e8f0" strokeWidth="1.5" />
                                {/* Node circle */}
                                <circle
                                    cx={stall.x}
                                    cy={stall.y}
                                    r="15"
                                    fill={selectedStall?.id === stall.id ? '#ef4444' : '#3b82f6'}
                                    stroke="white"
                                    strokeWidth="3"
                                />
                                {/* Label */}
                                <text
                                    x={stall.x}
                                    y={stall.y + 4}
                                    textAnchor="middle"
                                    className="text-[9px] fill-white font-black select-none pointer-events-none"
                                >
                                    S{stall.id}
                                </text>
                            </g>
                        ))}
                    </g>

                    {/* Navigation Path */}
                    {showPath && (
                        <path
                            d={selectedStall ? calculatePath(selectedStall) : 'M 85,365 L 85,440 L 870,440'}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="12,12"
                            className="animate-[dash_40s_linear_infinite]"
                        />
                    )}
                </svg>

                {/* Legend toggle (mobile) */}
                <div className="absolute bottom-4 left-4 z-10 sm:hidden">
                    <button
                        onClick={() => setIsLegendOpen(!isLegendOpen)}
                        className="bg-white text-slate-700 p-2.5 rounded-full shadow-lg border-2 border-slate-300"
                    >
                        <Info className="w-5 h-5" />
                    </button>
                </div>

                {/* Legend */}
                <div className={`absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-44 z-10 transition-all duration-200 ${isLegendOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none sm:translate-y-0 sm:opacity-100 sm:pointer-events-auto'}`}>
                    <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-slate-200">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Legend</h3>
                            <button onClick={() => setIsLegendOpen(false)} className="sm:hidden text-slate-400"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                                <span className="text-[10px] font-bold text-slate-600">Project Stalls</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-orange-400" />
                                <span className="text-[10px] font-bold text-slate-600">Gourmet Zone</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-0.5 bg-red-500 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-600">Guided Path</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stall Detail Popup - NO backdrop-blur to avoid blurring the map */}
            {selectedStall && (
                <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center">
                    {/* Backdrop - solid opacity, no blur */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setSelectedStall(null)}
                    />
                    {/* Card */}
                    <div className="relative bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden z-10">
                        <div className="bg-blue-600 px-5 py-4 text-white relative">
                            <div className="flex items-center gap-1.5 opacity-80 text-[9px] font-black uppercase mb-1 tracking-widest">
                                <MapPin className="w-3 h-3" /> Exhibit S{selectedStall.id}
                            </div>
                            <h2 className="text-xl font-black leading-tight tracking-tight pr-8">{selectedStall.title}</h2>
                            <button
                                onClick={() => setSelectedStall(null)}
                                className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 p-1.5 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="px-5 py-4">
                            <p className="text-slate-600 text-sm leading-relaxed font-medium mb-4">
                                {selectedStall.description}
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedStall(null);
                                    setShowPath(true);
                                }}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-[0.98] transition-transform"
                            >
                                Start Navigation
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes dash { to { stroke-dashoffset: -1000; } }`}</style>
        </div>
    );
};

export default App;
