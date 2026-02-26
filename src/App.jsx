import React, { useState, useMemo, useCallback } from 'react';
import { MapPin, X, Navigation, Beaker, Info, Utensils, Trees, Trophy, List } from 'lucide-react';
import { calculatePath } from './utils/navigation';

// Extracted and Memoized Building Component to prevent map re-renders
const Building = React.memo(({ x, y, w, h, label, color = '#3b82f6', icon: Icon, tagPos = 'top', onClick, isSelected }) => (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} className={onClick ? "cursor-pointer group" : ""}>
        <rect width={w} height={h} x="4" y="4" fill="#94a3b8" rx="4" opacity="0.3" />
        <rect width={w} height={h} fill={isSelected ? '#fee2e2' : 'white'} stroke={isSelected ? '#ef4444' : '#475569'} strokeWidth={isSelected ? '3' : '2'} rx="4" className={onClick ? "transition-colors duration-300" : ""} />
        <rect x="2" y="2" width={w - 4} height="6" fill={isSelected ? '#ef4444' : color} rx="2" className={onClick ? "transition-colors duration-300" : ""} />
        <g transform={tagPos === 'top' ? `translate(${w / 2}, -10)` : `translate(${w / 2}, ${h + 14})`}>
            <text textAnchor="middle" className={`text-[9px] font-black uppercase tracking-wide ${isSelected ? 'fill-red-600' : 'fill-slate-700'} ${onClick ? 'group-hover:text-red-500 transition-colors' : ''}`}>
                {label}
            </text>
        </g>
        {Icon && <Icon className={`opacity-10 pointer-events-none ${isSelected ? 'text-red-500' : 'text-slate-400'}`} x={w / 2 - 10} y={h / 2 - 10} width={20} height={20} />}
    </g>
));

const App = () => {
    const [selectedStall, setSelectedStall] = useState(null);
    const [showPath, setShowPath] = useState(false);
    const [isLegendOpen, setIsLegendOpen] = useState(false);
    const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);

    // Layout Constants - matching original map.js coordinates
    const islandCenter = useMemo(() => ({ x: 440, y: 260 }), []);
    const radius = 80;
    const vRoad1X = 270;
    const vRoad2X = 580;

    // Memoize static data structures
    const { blockData, block2WorkshopsNode, rdBlockWorkshopNode, allDestinations } = useMemo(() => {
        // Block Data around Island
        const blocks = [
            { id: 'internal', title: "Internal Projects", short: "INTERNAL", desc: "A dedicated area showcasing intra-collegiate projects, student research, and internal technological innovations.", angle: 210 },
            { id: 'external', title: "External Innovations", short: "EXTERNAL", desc: "Guest exhibits featuring cutting-edge prototypes, projects, and ideas from visiting academic institutions.", angle: 330 },
            { id: 'industrial', title: "Industrial Partners", short: "INDUSTRY", desc: "Professional demonstrations highlighting real-world applications and future technologies brought by our corporate partners.", angle: 90 }
        ].map((info) => {
            const rad = info.angle * (Math.PI / 180);
            return {
                ...info,
                location: "Island Perimeter",
                description: info.desc,
                x: Math.round(islandCenter.x + 95 * Math.cos(rad)),
                y: Math.round(islandCenter.y + 95 * Math.sin(rad))
            };
        });

        const block2 = {
            id: 'workshops_block2',
            title: "Technical Workshops",
            short: "WORKSHOPS",
            location: "Block 2",
            description: "📍 VENUE: First Floor, Block 2\n\n🤖 Workshop on Essentials of Robotics\nVENUE: BCA Lab\n\n🧠 Workshop on Essential AI Tools\nVENUE: MCA Lab",
            x: 565,
            y: 290
        };

        const rdBlock = {
            id: 'workshop_rd',
            title: "Quantum Workshop",
            short: "QUATUM TECH",
            location: "R&D Block",
            description: "🧪 Essentials of Quantum Technologies\n\n📍 VENUE: 402, 4th Floor, R&D Block",
            x: 780,
            y: 510
        };

        return {
            blockData: blocks,
            block2WorkshopsNode: block2,
            rdBlockWorkshopNode: rdBlock,
            allDestinations: [...blocks, block2, rdBlock]
        };
    }, [islandCenter]);

    // Optimize click handlers
    const handleNodeClick = useCallback((e, node) => {
        e.stopPropagation();
        setSelectedStall(node);
        if (!showPath) setShowPath(true);
    }, [showPath]);

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
                <div className="flex flex-row items-center gap-2">
                    <button
                        onClick={() => setIsDirectoryOpen(!isDirectoryOpen)}
                        className={`p-2 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black transition-colors border-2 border-slate-200 bg-white text-slate-800 hover:bg-slate-50`}
                    >
                        <List className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">DIRECTORY</span>
                    </button>
                    <button
                        onClick={() => setShowPath(!showPath)}
                        className={`p-2 sm:px-3 sm:py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-black transition-colors border-2 border-slate-800 ${showPath ? 'bg-slate-800 text-white' : 'bg-white text-slate-800'}`}
                    >
                        <Navigation className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">{showPath ? 'PATH ON' : 'PATH OFF'}</span>
                    </button>
                </div>
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

                    {/* Navigation Path - Moved to back layer so it doesn't overlap buildings */}
                    {showPath && selectedStall && (
                        <path
                            d={calculatePath(selectedStall)}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="12,12"
                            className="animate-[dash_40s_linear_infinite] opacity-80"
                        />
                    )}

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
                    <Building
                        x={720} y={480} w={120} h={60}
                        label="R&D Block"
                        color="#9333ea"
                        tagPos="bottom"
                        onClick={(e) => { e.stopPropagation(); setSelectedStall(rdBlockWorkshopNode); }}
                        isSelected={selectedStall?.id === 'workshop_rd'}
                    />

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
                    <Building
                        x={545} y={220} w={40} h={140}
                        label="Workshops (Block 2)"
                        tagPos="top"
                        color="#6366f1"
                        onClick={(e) => { e.stopPropagation(); setSelectedStall(block2WorkshopsNode); }}
                        isSelected={selectedStall?.id === 'workshops_block2'}
                    />
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

                        {/* Exhibition Hub Nodes */}
                        {blockData.map(block => (
                            <g
                                key={block.id}
                                className="cursor-pointer group"
                                onClick={(e) => handleNodeClick(e, block)}
                                transform={`translate(${block.x - 35}, ${block.y - 14})`}
                            >
                                <rect
                                    width="70"
                                    height="28"
                                    rx="6"
                                    fill={selectedStall?.id === block.id ? '#ef4444' : '#3b82f6'}
                                    className="group-hover:fill-blue-400 shadow-sm transition-colors duration-300"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                                <text x="35" y="17" textAnchor="middle" className="text-[8px] fill-white font-black select-none pointer-events-none uppercase tracking-wider">
                                    {block.short}
                                </text>
                            </g>
                        ))}
                    </g>

                    {/* Destination Ping visually pulsing OVER the buildings but not blocking clicks */}
                    {selectedStall && (
                        <circle
                            cx={selectedStall.x}
                            cy={selectedStall.y}
                            r="28"
                            className="animate-ping fill-red-500/50 pointer-events-none"
                            style={{ animationDuration: '2s' }}
                        />
                    )}
                </svg>

                {/* Legend toggle (mobile) */}
                <div className="absolute bottom-4 left-4 z-10 sm:hidden pointer-events-none">
                    <button
                        onClick={() => setIsLegendOpen(!isLegendOpen)}
                        className="bg-white text-slate-700 p-2.5 rounded-full shadow-lg border-2 border-slate-300 pointer-events-auto"
                    >
                        <Info className="w-5 h-5" />
                    </button>
                </div>

                {/* Legend */}
                <div className={`absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-44 z-10 transition-all duration-200 pointer-events-none ${isLegendOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 sm:translate-y-0 sm:opacity-100'}`}>
                    <div className="bg-white p-3 rounded-xl shadow-lg border-2 border-slate-200 pointer-events-auto">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Legend</h3>
                            <button onClick={() => setIsLegendOpen(false)} className="sm:hidden text-slate-400"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-3 rounded bg-blue-600 border border-white shadow-sm" />
                                <span className="text-[10px] font-bold text-slate-600">Exhibition Hubs</span>
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
                                    <MapPin className="w-3 h-3" /> {selectedStall.short} {(!selectedStall.id.includes('workshop')) ? 'HUB' : 'VENUE'}
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
                                <p className="text-slate-600 text-sm leading-relaxed font-medium mb-4 whitespace-pre-line">
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

                {/* Directory Slide-over / Modal */}
                {isDirectoryOpen && (
                    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDirectoryOpen(false)} />
                        <div className="relative bg-white w-full sm:max-w-md max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
                            <div className="bg-slate-900 px-5 py-4 text-white flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-lg font-black tracking-tight">Exhibition Directory</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Find Hubs & Workshops</p>
                                </div>
                                <button onClick={() => setIsDirectoryOpen(false)} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
                                {allDestinations.map(dest => (
                                    <button
                                        key={dest.id}
                                        onClick={() => {
                                            setSelectedStall(dest);
                                            setShowPath(true);
                                            setIsDirectoryOpen(false);
                                        }}
                                        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left hover:border-blue-500 hover:shadow-md transition-all group active:scale-[0.98]"
                                    >
                                        <div className="flex justify-between items-start mb-1.5">
                                            <h3 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">{dest.title}</h3>
                                            <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{dest.location}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium line-clamp-2">{dest.description.replace(/\n\n/g, ' - ').replace(/\n/g, ' ')}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <style>{`@keyframes dash { to { stroke-dashoffset: -1000; } }`}</style>
            </div>
        </div>
    );
};

export default App;
