import React, { useState, useRef, useCallback, useEffect } from 'react'

/**
 * DraggableRadarChart
 * A fully custom SVG radar/spider chart with draggable data points.
 *
 * Props:
 *   axes      – array of { key: string, score: number, target: number }
 *               score & target are in [0, 100]
 *   onChange  – optional callback(updatedAxes) when a user drags a point
 */
export default function DraggableRadarChart({ axes, onChange }) {
  const svgRef = useRef(null)
  const [values, setValues] = useState(() => axes.map((a) => a.score))
  const targets = axes.map((a) => a.target)

  // Sync if parent axes prop changes
  useEffect(() => {
    setValues(axes.map((a) => a.score))
  }, [axes])

  const N = axes.length
  const SIZE = 320           // SVG viewBox size
  const CX = SIZE / 2        // center x
  const CY = SIZE / 2        // center y
  const R = 120              // max radius
  const LEVELS = 5           // concentric grid rings

  // Angle for axis i (starting from top, clockwise)
  const axisAngle = (i) => (i * (2 * Math.PI)) / N - Math.PI / 2

  // Point on axis i at fraction t (0–1)
  const axisPoint = (i, t) => ({
    x: CX + t * R * Math.cos(axisAngle(i)),
    y: CY + t * R * Math.sin(axisAngle(i)),
  })

  // Build SVG polygon points string from values array
  const polygonPoints = (vals) =>
    vals
      .map((v, i) => {
        const { x, y } = axisPoint(i, v / 100)
        return `${x},${y}`
      })
      .join(' ')

  // Label position (slightly beyond max radius)
  const labelPos = (i) => {
    const LABEL_R = R + 26
    return {
      x: CX + LABEL_R * Math.cos(axisAngle(i)),
      y: CY + LABEL_R * Math.sin(axisAngle(i)),
    }
  }

  // ─── Drag state ───────────────────────────────────────────────────────────
  const dragging = useRef(null) // { index, startValue }

  const getSVGPos = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    // Map screen coords → viewBox coords
    const scaleX = SIZE / rect.width
    const scaleY = SIZE / rect.height
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    }
  }, [])

  const onPointDown = useCallback(
    (e, i) => {
      e.preventDefault()
      e.stopPropagation()
      dragging.current = i

      const onMove = (ev) => {
        if (dragging.current === null) return
        const { x, y } = getSVGPos(ev)
        const dx = x - CX
        const dy = y - CY
        // Project (dx, dy) onto the axis unit vector
        const angle = axisAngle(dragging.current)
        const ux = Math.cos(angle)
        const uy = Math.sin(angle)
        const proj = dx * ux + dy * uy // signed distance along axis
        const newVal = Math.round(Math.max(0, Math.min(100, (proj / R) * 100)))

        setValues((prev) => {
          const next = [...prev]
          next[dragging.current] = newVal
          return next
        })
      }

      const onUp = () => {
        dragging.current = null
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
        window.removeEventListener('touchmove', onMove)
        window.removeEventListener('touchend', onUp)
      }

      window.addEventListener('mousemove', onMove, { passive: false })
      window.addEventListener('mouseup', onUp)
      window.addEventListener('touchmove', onMove, { passive: false })
      window.addEventListener('touchend', onUp)
    },
    [getSVGPos]
  )

  // Fire onChange whenever values update
  useEffect(() => {
    if (onChange) {
      onChange(
        axes.map((a, i) => ({ ...a, score: values[i] }))
      )
    }
  }, [values])

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full select-none" style={{ cursor: 'default' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible', touchAction: 'none' }}
      >
        {/* ── Concentric grid rings ─────────────────────────────── */}
        {Array.from({ length: LEVELS }).map((_, lvl) => {
          const t = ((lvl + 1) / LEVELS)
          const pts = Array.from({ length: N })
            .map((__, i) => {
              const { x, y } = axisPoint(i, t)
              return `${x},${y}`
            })
            .join(' ')
          return (
            <polygon
              key={`grid-${lvl}`}
              points={pts}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
            />
          )
        })}

        {/* ── Axis spokes ───────────────────────────────────────── */}
        {Array.from({ length: N }).map((_, i) => {
          const outer = axisPoint(i, 1)
          return (
            <line
              key={`spoke-${i}`}
              x1={CX}
              y1={CY}
              x2={outer.x}
              y2={outer.y}
              stroke="#334155"
              strokeWidth="1"
            />
          )
        })}

        {/* ── Target benchmark area (light cyan fill) ───────────── */}
        <polygon
          points={polygonPoints(targets)}
          fill="#06b6d4"
          fillOpacity={0.15}
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* ── Candidate score filled area (indigo/purple) ───────── */}
        <polygon
          points={polygonPoints(values)}
          fill="#6366f1"
          fillOpacity={0.45}
          stroke="#818cf8"
          strokeWidth={2}
        />

        {/* ── Draggable data points ─────────────────────────────── */}
        {values.map((v, i) => {
          const { x, y } = axisPoint(i, v / 100)
          return (
            <g key={`point-${i}`}>
              {/* Outer glow ring */}
              <circle
                cx={x}
                cy={y}
                r={10}
                fill="#6366f1"
                fillOpacity={0.25}
                stroke="#818cf8"
                strokeWidth={1}
                style={{ cursor: 'grab' }}
                onMouseDown={(e) => onPointDown(e, i)}
                onTouchStart={(e) => onPointDown(e, i)}
              />
              {/* Inner solid dot */}
              <circle
                cx={x}
                cy={y}
                r={5}
                fill="#ffffff"
                stroke="#818cf8"
                strokeWidth={1.5}
                style={{ cursor: 'grab', pointerEvents: 'none' }}
              />
              {/* Value badge */}
              <text
                x={x}
                y={y - 14}
                textAnchor="middle"
                dominantBaseline="auto"
                fontSize="9"
                fontWeight="bold"
                fill="#a5b4fc"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* ── Axis labels ───────────────────────────────────────── */}
        {axes.map((a, i) => {
          const { x, y } = labelPos(i)
          const angle = axisAngle(i)
          // Determine text anchor based on position
          let anchor = 'middle'
          if (Math.cos(angle) > 0.3) anchor = 'start'
          else if (Math.cos(angle) < -0.3) anchor = 'end'

          // Split long labels into two lines
          const words = a.key.split(' ')
          const mid = Math.ceil(words.length / 2)
          const line1 = words.slice(0, mid).join(' ')
          const line2 = words.slice(mid).join(' ')

          return (
            <text
              key={`label-${i}`}
              x={x}
              y={y}
              textAnchor={anchor}
              dominantBaseline="middle"
              fontSize="10"
              fontWeight="600"
              fill="#cbd5e1"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {line2 ? (
                <>
                  <tspan x={x} dy="-6">{line1}</tspan>
                  <tspan x={x} dy="13">{line2}</tspan>
                </>
              ) : (
                line1
              )}
            </text>
          )
        })}

        {/* ── Center dot ───────────────────────────────────────── */}
        <circle cx={CX} cy={CY} r={3} fill="#475569" />
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-3 justify-center text-[11px] font-semibold text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#6366f1', opacity: 0.8 }} />
          Candidate Score
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-5 border-t-2 border-dashed border-cyan-400" />
          Staff Benchmark
        </span>
        <span className="text-[10px] text-indigo-400 font-mono italic">drag points to adjust</span>
      </div>
    </div>
  )
}
