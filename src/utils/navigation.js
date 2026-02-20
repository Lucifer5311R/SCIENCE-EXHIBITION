// Navigation path calculator for SVG wayfinder
// All coordinates are relative to the 900x600 SVG viewBox

const NAV_POINTS = {
    start: { x: 85, y: 365 },       // Registration Desk center
    mainRoad: { x: 85, y: 440 },     // Drop down to main road
    junction1: { x: 285, y: 440 },   // Left vertical road junction
    junction2: { x: 595, y: 440 },   // Right vertical road junction
    vRoad1Top: { x: 285, y: 260 },   // Top of left vertical road
    vRoad2Top: { x: 595, y: 260 },   // Top of right vertical road
    islandCenter: { x: 440, y: 260 }
};

export const calculatePath = (targetStall) => {
    if (!targetStall) return 'M 85,365 L 85,440 L 870,440';

    const { x: tx, y: ty } = targetStall;
    const { start, mainRoad, junction1, junction2, vRoad1Top, vRoad2Top, islandCenter } = NAV_POINTS;

    // Start: Registration -> Main Road
    let path = `M ${start.x},${start.y} L ${mainRoad.x},${mainRoad.y}`;

    // Route decision: use left road if stall is left of center, right road otherwise
    const useLeftRoad = tx <= islandCenter.x;

    if (useLeftRoad) {
        path += ` L ${junction1.x},${junction1.y}`;  // Along main road to left junction
        path += ` L ${vRoad1Top.x},${vRoad1Top.y}`;  // Up the left vertical road
        path += ` L ${tx},${ty}`;                     // Direct line to stall
    } else {
        path += ` L ${junction2.x},${junction2.y}`;  // Along main road to right junction
        path += ` L ${vRoad2Top.x},${vRoad2Top.y}`;  // Up the right vertical road
        path += ` L ${tx},${ty}`;                     // Direct line to stall
    }

    return path;
};
