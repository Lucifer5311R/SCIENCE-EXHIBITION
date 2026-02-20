import React, { useState } from 'react';
import { MapPin, X, Navigation, Beaker, Info, Utensils, Flag, Trees, Trophy } from 'lucide-react';

const App = () => {
    const [selectedStall, setSelectedStall] = useState(null);
    const [showPath, setShowPath] = useState(true);

    // Layout Constants
    const islandCenter = { x: 440, y: 260 };
    const radius = 65;
    const vRoad1X = 270; // Left vertical road
    const vRoad2X = 580; // Right vertical road

    // Stall Data around Island
    const stallData = [
        { title: "Quantum Computing", desc: "Demonstrations of superconducting circuits and qubits." },
        { title: "Renewable Systems", desc: "Solar tracking and wind turbine optimization models." },
        { title: "Bio-Genetics", desc: "CRISPR-Cas9 visualization and plant DNA extraction." },
        { title: "Robotics & AI", desc: "Autonomous rover navigating a simulated Martian terrain." },
        { title: "Astro-Physics", desc: "Solar telescope and deep-space imaging display." },
        { title: "Marine Biology", desc: "Coral reef restoration and aquatic ecosystem sensors." },
        { title: "Structural Engineering", desc: "Bridge stress-testing and seismic-resistant builds." },
        { title: "Nano-Tech", desc: "Microscopic world viewing and carbon nanotube models." }
    ].map((info, i) => {
        const angle = (i * 45) * (Math.PI / 180);
        return {
            id: i + 1,
            title: info.title,
            location: "Island Perimeter",
            description: info.desc,
            x: islandCenter.x + radius * Math.cos(angle),
            y: islandCenter.y + radius * Math.sin(angle)
        };
    });

    // Reusable Building Component for SVG
    const Building = ({ x, y, w, h, label, color = "#3b82f6", icon: Icon, tagPos = "top" }) => (
        <g transform={`translate(${x}, ${y})`}>
            <rect width={w} height={h} rx="4" className="fill-white stroke-slate-300 stroke-[1.5px]" />
            <rect width={w} height="4" rx="2" fill={color} />
            {/* External Label Tag to prevent overlap */}
            <g transform={tagPos === "top" ? `translate(${w / 2}, -12)` : `translate(${w / 2}, ${h + 15})`}>
                <text textAnchor="middle" className="text-[10px] font-black fill-slate-500 uppercase tracking-tighter">
                    {label}
                </text>
            </g>
            {Icon && <Icon className="opacity-10 text-slate-400" x={w / 2 - 10} y={h / 2 - 10} width={20} height={20} />}
        </g>
    );

    return (
        <div className="flex flex-col h-screen bg-[#f1f5f9] text-slate-800 overflow-hidden font-sans">
            {/* Modern Header */}
            <header className="bg-white shadow-sm p-4 z-10 flex justify-between items-center border-b border-slate-200">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-lg">
                        <Beaker className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-slate-900 leading-none">Christ University</h1>
                        <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Exhibition Wayfinder</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowPath(!showPath)}
                    className={`px-3 py-2 rounded-lg flex items-center gap-2 text-[10px] font-black transition-all ${showPath ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-400 border border-slate-200'
                        }`}
                >
                    <Navigation className="w-3.5 h-3.5" />
                    {showPath ? 'PATH VISIBLE' : 'PATH HIDDEN'}
                </button>
            </header>

            {/* Interactive Map Area */}
            <div className="relative flex-1 overflow-hidden touch-none bg-white">
                <svg
                    viewBox="0 0 900 600"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                >
                    {/* Subtle Grid */}
                    <defs>
                        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                            <circle cx="1" cy="1" r="1" fill="#e2e8f0" />
                        </pattern>
                    </defs>
                    <rect width="900" height="600" fill="url(#grid)" />

                    {/* Roads System */}
                    <g fill="#cbd5e1">
                        {/* Main Road */}
                        <rect x="0" y="420" width="900" height="40" rx="2" />
                        {/* Vertical Road 1 (Left) */}
                        <rect x={vRoad1X} y="250" width="30" height="170" />
                        {/* Vertical Road 2 (Right) */}
                        <rect x={vRoad2X} y="200" width="30" height="220" />
                    </g>
                    <text x="860" y="445" className="fill-slate-500 font-black text-[10px]">EXIT</text>

                    {/* BOTTOM ROW BUILDINGS */}
                    <Building x={30} y={480} w={80} h={60} label="Audi Block" tagPos="bottom" />
                    <Building x={130} y={480} w={80} h={60} label="CJC" tagPos="bottom" />

                    {/* Central Block + Gourmet Integrated */}
                    <g transform="translate(260, 480)">
                        <rect width="120" height="70" rx="4" className="fill-white stroke-slate-300 stroke-[1.5px]" />
                        <rect width="120" height="4" rx="2" fill="#1e40af" />
                        <rect x="95" y="10" width="20" height="50" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
                        <text x="105" y="35" textAnchor="middle" className="text-[6px] font-black fill-amber-700 rotate-90">GOURMET</text>
                        <text x="50" y="-12" textAnchor="middle" className="text-[10px] font-black fill-slate-500 uppercase">Central Block</text>
                    </g>

                    <Building x={430} y={480} w={140} h={60} label="Ground" color="#10b981" tagPos="bottom" />
                    <Building x={620} y={480} w={100} h={60} label="Block 4" tagPos="bottom" />
                    <Building x={760} y={480} w={100} h={60} label="R&D Block" color="#9333ea" tagPos="bottom" />

                    {/* TOP ROW BUILDINGS */}
                    {/* Registration - Start point */}
                    <g transform="translate(40, 340)">
                        <rect width="90" height="50" rx="6" fill="#ef4444" className="shadow-lg" />
                        <text x="45" y="25" textAnchor="middle" className="text-[9px] font-black fill-white uppercase">Registration</text>
                        <text x="45" y="38" textAnchor="middle" className="text-[8px] font-bold fill-white/80 uppercase tracking-tighter">Desk</text>
                        <Flag className="text-white/40" x="35" y="15" width="20" height="20" />
                    </g>

                    {/* Basketball Court - LEFT of the path */}
                    <Building x={150} y={220} w={100} h={70} label="Basket Ball Court" color="#f97316" icon={Trophy} />

                    {/* Block 1 - Center Top */}
                    <Building x={350} y={60} w={180} h={100} label="Block 1" strokeWidth="3" />

                    {/* Block 2 - Between Island and Vertical Road 2 */}
                    <Building x={520} y={220} w={40} h={140} label="Block 2" tagPos="top" />

                    {/* Block 3 - Right of Vertical Road 2 */}
                    <Building x={630} y={180} w={110} h={80} label="Block 3" />

                    {/* Birds Park - Top Right */}
                    <Building x={650} y={40} w={140} h={80} label="Birds Park" color="#22c55e" icon={Trees} />

                    {/* EXHIBITION ISLAND HUB */}
                    <g>
                        <circle cx={islandCenter.x} cy={islandCenter.y} r={radius + 10} fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
                        <circle cx={islandCenter.x} cy={islandCenter.y} r={radius} fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8,4" />

                        <circle cx={islandCenter.x} cy={islandCenter.y} r="40" fill="#064e3b" className="shadow-lg" />
                        <text x={islandCenter.x} y={islandCenter.y + 5} textAnchor="middle" className="text-[12px] font-black fill-white uppercase tracking-widest">Island</text>

                        {/* Interactive S-Nodes */}
                        {stallData.map(stall => (
                            <g
                                key={stall.id}
                                className="cursor-pointer group"
                                onClick={() => setSelectedStall(stall)}
                            >
                                <circle
                                    cx={stall.x}
                                    cy={stall.y}
                                    r="13"
                                    fill="#3b82f6"
                                    className="group-hover:fill-blue-500 transition-all shadow-md group-hover:scale-110"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                                <text x={stall.x} y={stall.y + 4} textAnchor="middle" className="text-[9px] fill-white font-black select-none">S{stall.id}</text>
                            </g>
                        ))}
                    </g>

                    {/* Navigation Path Logic */}
                    {showPath && (
                        <path
                            d={`M 85,390 L 85,440 L 870,440`}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeDasharray="12,12"
                            className="animate-[dash_40s_linear_infinite]"
                        />
                    )}
                </svg>

                {/* Floating Legend Overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 pointer-events-auto w-48">
                        <h3 className="text-[9px] font-black uppercase text-slate-400 mb-3 tracking-widest">Navigator</h3>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-3">
                                <div className="w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                                <span className="text-[10px] font-bold text-slate-700">Project Stalls</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-3.5 h-3.5 rounded bg-amber-400" />
                                <span className="text-[10px] font-bold text-slate-700">Gourmet Zone</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-1 bg-red-500 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-700">Guided Path</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 pointer-events-auto">
                        <Info className="w-3 h-3 text-blue-400" />
                        <span className="text-[9px] font-black uppercase tracking-wider">Tap S-Nodes for Details</span>
                    </div>
                </div>

                {/* Popup Overlay */}
                {selectedStall && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6">
                        <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                            <div className="bg-blue-600 p-6 text-white relative">
                                <div className="flex items-center gap-2 opacity-80 text-[9px] font-black uppercase mb-1 tracking-widest">
                                    <MapPin className="w-3 h-3" /> Exhibit S{selectedStall.id}
                                </div>
                                <h2 className="text-2xl font-black leading-tight tracking-tight">{selectedStall.title}</h2>
                                <button
                                    onClick={() => setSelectedStall(null)}
                                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-1.5 rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6">
                                    {selectedStall.description}
                                </p>
                                <button
                                    onClick={() => setSelectedStall(null)}
                                    className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg"
                                >
                                    Confirm Visit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes dash { to { stroke-dashoffset: -1000; } }
      `}</style>
        </div>
    );
};

export default App;