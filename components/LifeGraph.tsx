
import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { MonthlyData } from '../types';
import { MONTH_NAMES, getScoreColor } from '../constants';

interface LifeGraphProps {
  data: MonthlyData[];
  onUpdateScore: (monthIndex: number, newScore: number) => void;
  onMonthClick: (monthIndex: number) => void;
  activeMonth: number | null;
}

const LifeGraph: React.FC<LifeGraphProps> = ({ data, onUpdateScore, onMonthClick, activeMonth }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const mobile = width < 768;
        setIsMobile(mobile);
        const height = mobile ? 320 : 450; 
        setDimensions({ width, height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 반응형 여백 설정
  const padding = useMemo(() => ({
    top: isMobile ? 40 : 60,
    right: isMobile ? 30 : 50,
    bottom: isMobile ? 70 : 100,
    left: isMobile ? 30 : 50
  }), [isMobile]);

  const xScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([1, 12])
      .range([padding.left, dimensions.width - padding.right]);
  }, [dimensions.width, padding.left, padding.right]);

  const yScale = useMemo(() => {
    return d3.scaleLinear()
      .domain([0, 100])
      .range([dimensions.height - padding.bottom, padding.top]);
  }, [dimensions.height, padding.top, padding.bottom]);

  const lineGenerator = d3.line<MonthlyData>()
    .x(d => xScale(d.month))
    .y(d => yScale(d.score))
    .curve(d3.curveMonotoneX);

  const areaGenerator = d3.area<MonthlyData>()
    .x(d => xScale(d.month))
    .y0(dimensions.height - padding.bottom)
    .y1(d => yScale(d.score))
    .curve(d3.curveMonotoneX);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging === null || !svgRef.current) return;
    const [mx, my] = d3.pointer(e, svgRef.current);
    const newScore = Math.max(0, Math.min(100, yScale.invert(my)));
    onUpdateScore(isDragging, Math.round(newScore));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging !== null) {
      const target = e.currentTarget as Element;
      target.releasePointerCapture(e.pointerId);
      setIsDragging(null);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full relative touch-none select-none"
      style={{ touchAction: 'none' }}
    >
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="overflow-visible cursor-crosshair"
      >
        <defs>
          <linearGradient id="mainFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            {data.map((d, i) => (
              <stop 
                key={i} 
                offset={`${(i / 11) * 100}%`} 
                stopColor={getScoreColor(d.score)} 
              />
            ))}
          </linearGradient>
          <linearGradient id="dreamyVerticalFade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="softAreaMask">
             <rect x="0" y="0" width="100%" height="100%" fill="url(#dreamyVerticalFade)" />
          </mask>
          <filter id="etherealGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={isMobile ? "4" : "8"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 배경 그리드 */}
        {[0, 50, 100].map(val => (
          <g key={val} className="pointer-events-none opacity-20">
            <line
              x1={padding.left}
              x2={dimensions.width - padding.right}
              y1={yScale(val)}
              y2={yScale(val)}
              stroke="#cbd5e1"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
          </g>
        ))}

        <path
          d={areaGenerator(data) || ''}
          fill="url(#mainFlowGradient)"
          mask="url(#softAreaMask)"
          className="transition-all duration-700 ease-out"
        />

        <path
          d={lineGenerator(data) || ''}
          fill="none"
          stroke="url(#mainFlowGradient)"
          strokeWidth={isMobile ? "2" : "4"}
          strokeLinecap="round"
          filter="url(#etherealGlow)"
          className="transition-all duration-700 ease-out opacity-80 pointer-events-none"
        />

        {data.map((d, i) => {
          const isActive = activeMonth === i || isDragging === i || hoveredMonth === i;
          const color = getScoreColor(d.score);
          const xPos = xScale(d.month);
          const yPos = yScale(d.score);
          
          return (
            <g key={i}>
              {/* 히트박스: 모바일에서 조작을 위해 r값 조정 */}
              <circle
                cx={xPos}
                cy={yPos}
                r={isMobile ? 35 : 50}
                fill="transparent"
                className="cursor-pointer"
                onPointerDown={(e) => { 
                  e.stopPropagation(); 
                  const target = e.currentTarget as Element;
                  target.setPointerCapture(e.pointerId);
                  setIsDragging(i); 
                }}
                onPointerEnter={() => setHoveredMonth(i)}
                onPointerLeave={() => setHoveredMonth(null)}
                onClick={() => isDragging === null && onMonthClick(i)}
              />

              {/* 포인트 */}
              <circle
                cx={xPos}
                cy={yPos}
                r={isActive ? (isMobile ? 7 : 10) : (isMobile ? 4 : 6)}
                fill="white"
                stroke={color}
                strokeWidth={isActive ? (isMobile ? 3 : 4) : 2}
                className="transition-all duration-300 pointer-events-none shadow-sm"
              />

              {/* 월 레이블 */}
              <text
                x={xPos}
                y={dimensions.height - padding.bottom + (isMobile ? 30 : 45)}
                textAnchor="middle"
                className={`transition-all duration-300 pointer-events-none font-bold ${
                  isActive ? 'fill-slate-900' : 'fill-slate-300'
                } ${isMobile ? 'text-[10px]' : 'text-[14px]'}`}
              >
                {isMobile ? (i + 1) : MONTH_NAMES[i]}
              </text>

              {/* 점수 툴팁 */}
              {isActive && (
                <g className="animate-in fade-in zoom-in duration-300 pointer-events-none">
                  <rect 
                    x={xPos - (isMobile ? 18 : 25)} 
                    y={yPos - (isMobile ? 35 : 50)} 
                    width={isMobile ? 36 : 50} 
                    height={isMobile ? 22 : 30} 
                    rx={isMobile ? 10 : 15} 
                    fill={color} 
                    className="shadow-lg"
                  />
                  <text
                    x={xPos}
                    y={yPos - (isMobile ? 20 : 30)}
                    textAnchor="middle"
                    className={`${isMobile ? 'text-[10px]' : 'text-[12px]'} font-black fill-white`}
                  >
                    {d.score}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default LifeGraph;
