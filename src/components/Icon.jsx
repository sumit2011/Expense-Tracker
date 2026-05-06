import React from "react";
// import food from "/icons/food.png";

const icons = {
  chevronLeft: ["path:m15 18-6-6 6-6"],
  chevronRight: ["path:m9 18 6-6-6-6"],
  chevronDown: ["path:m6 9 6 6 6-6"],
  plus: ["path:M12 5v14M5 12h14"],
  home: ["path:M3 10.5 12 4l9 6.5", "path:M5 10v9h14v-9", "path:M9 19v-5h6v5"],
  records: ["path:M7 3h8l4 4v14H7z", "path:M15 3v5h5", "path:M10 13h6M10 17h6"],
  wallet: ["path:M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "path:M18 12h3v4h-3a2 2 0 0 1 0-4z", "path:M3 7V5a2 2 0 0 1 2-2h12"],
  menu: ["path:M4 7h16M4 12h16M4 17h16"],
  search: ["circle:11:11:7", "path:m20 20-4-4"],
  bag: ["path:M6 8h12l-1 12H7z", "path:M9 8a3 3 0 0 1 6 0"],
  cash: ["rect:3:7:18:10:2", "circle:12:12:2", "path:M7 10v4M17 10v4"],
  briefcase: ["rect:4:7:16:12:2", "path:M9 7V5h6v2M4 12h16"],
  card: ["rect:3:6:18:12:2", "path:M3 10h18M7 15h4"],
  dots: ["path:M12 5h.01M12 12h.01M12 19h.01"],
  shield: ["path:M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6z", "path:m9 12 2 2 4-5"],
  eye: ["path:M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z", "circle:12:12:3"],
  trash: ["path:M3 6h18M8 6V4h8v2M6 6l1 15h10l1-15M10 11v6M14 11v6"],
  x: ["path:M6 6l12 12M6 18L18 6"],
  heart: ["path:M12 21s-8-5.33-8-10.5S7.5 2 12 6.3 20 2 20 10.5 12 21 12 21"],
  spark: ["path:M12 2 15 11 23 12 17 18 18 26 12 21 6 26 7 18 1 12 9 11 12 2"],
  // New icons
  utensils: ["path:M3 2l7 7M3 9l7-7M9 2l7 7M9 9l7-7M5 9v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"],
  scooter: ["path:M5 12h14M8 12v6M16 12v6M6 18h12M10 6h4l2 6"],
  shoppingBag: ["path:M6 8h12l-1 12H7z", "path:M9 8V6a3 3 0 0 1 6 0v2"],
  car: ["path:M5 11l2-4h10l2 4M7 11v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-8M3 11h18M8 15h8"],
  bus: ["path:M4 7h16l-1 12H5z", "path:M8 7V5h8v2M4 11h16M7 15h2M15 15h2"],
  heartLightning: ["path:M12 21s-8-5.33-8-10.5S7.5 2 12 6.3c0 0 2-2 5 0M13 10l-2 4h3l-1 3"],
  smiley: ["circle:12:12:10", "path:M8 12s1.5 2 4 2 4-2 4-2M8 9h.01M16 9h.01"],
  dollarBox: ["rect:3:3:18:18:2", "path:M12 8v8M8 12h8M15 15l-3-3M9 9l3 3"],
  building: ["path:M3 21h18M4 21V7h16v14M8 11v4M12 11v4M16 11v4M8 7V4h8v3"],
  calendar: ["rect:3:4:18:18:2", "path:M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"],
  document: ["path:M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "path:M14 2v6h6M10 13h6M10 17h6"],
  edit: ["path:M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "path:M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],


};

export default function Icon({ name, className = "", ...props }) {
  
  return (
    <svg className={["icon", className].filter(Boolean).join(" ")} viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {(icons[name] || icons.menu).map((shape, index) => {
        const [type, ...parts] = shape.split(":");
        if (type === "circle") return <circle key={index} cx={parts[0]} cy={parts[1]} r={parts[2]} />;
        if (type === "rect") return <rect key={index} x={parts[0]} y={parts[1]} width={parts[2]} height={parts[3]} rx={parts[4]} />;
        return <path key={index} d={parts.join(":")} />;
      })}
    </svg>
  );
}
