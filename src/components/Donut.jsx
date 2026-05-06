import React from "react";

export default function Donut({ amount = 5350.43, currency = "USD", segments = [] }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
  };

  let gradientStops = 'var(--blue) 0 20%, transparent 20% 26%, var(--pink) 26% 34%, transparent 34% 40%, var(--yellow) 40% 56%, transparent 56% 62%, var(--orange) 62% 69%, transparent 69% 75%, var(--green) 75% 94%, transparent 94% 100%';

  if (segments.length > 0) {
    const numGaps = segments.length - 1;
    const totalGapPercent = numGaps * 6;
    const totalColorPercent = 100 - totalGapPercent;
    const scaledSegments = segments.map(seg => ({
      ...seg,
      percent: (seg.percent / 100) * totalColorPercent
    }));

    const stops = [];
    let current = 0;
    scaledSegments.forEach((seg, i) => {
      const start = current;
      const end = current + seg.percent;
      stops.push(`${seg.color} ${start}% ${end}%`);
      if (i < scaledSegments.length - 1) {
        stops.push(`transparent ${end}% ${end + 6}%`);
        current = end + 6;
      } else {
        current = end;
      }
    });
    if (current < 100) {
      stops.push(`transparent ${current}% 100%`);
    }
    gradientStops = stops.join(', ');
  }

  return (
    <div className="donut-wrap">
      <div className="donut" style={{ '--dynamic-gradient': `conic-gradient(from -26deg, ${gradientStops})` }}>
        <div className="donut-center">
          <p className="label">Expense</p>
          <p className="amount">{formatCurrency(amount)}</p>
        </div>
      </div>
    </div>
  );
}
