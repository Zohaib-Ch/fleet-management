import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Custom marker icon factory ────────────────────────────────────────────────
const STATUS_HEX = {
  Moving:      '#10B981',
  Resting:     '#F59E0B',
  Idle:        '#94A3B8',
  Maintenance: '#EF4444',
}

const createMarkerIcon = (status, isFocused, isSelected) => {
  const color   = STATUS_HEX[status] || '#94A3B8'
  const ring    = isSelected ? `box-shadow:0 0 0 3px ${color}40,0 0 0 6px ${color}20;` : ''
  const scale   = isFocused || isSelected ? 'transform:scale(1.3);' : ''
  const bg      = isSelected ? color : '#ffffff'
  const stroke  = isSelected ? '#ffffff' : color

  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative;display:flex;align-items:center;justify-content:center;${scale}transition:transform .2s">
        <div style="
          width:30px;height:30px;background:${bg};border:2px solid ${color};
          border-radius:10px;display:flex;align-items:center;justify-content:center;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);${ring}
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
            <path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-2.39-2.93A1 1 0 0 0 18.64 11H15v7a1 1 0 0 0 1 1z"/>
            <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
          </svg>
        </div>
        <div style="
          position:absolute;top:-3px;right:-3px;
          width:8px;height:8px;background:${color};
          border-radius:50%;border:1.5px solid white;
        "></div>
      </div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  })
}

// ── Suppress map double-click zoom ──────────────────────────────────────────
const DisableDoubleClickZoom = () => {
  const map = useMapEvents({
    dblclick: (e) => {
      e.originalEvent.preventDefault()
      e.originalEvent.stopPropagation()
    }
  })
  useEffect(() => { map.doubleClickZoom.disable() }, [map])
  return null
}

// ── Map controller — pans to focused vehicle ──────────────────────────────────
const MapController = ({ focusedVehicle }) => {
  const map = useMap()
  useEffect(() => {
    if (focusedVehicle?.lat && focusedVehicle?.lng) {
      map.flyTo([focusedVehicle.lat, focusedVehicle.lng], 14, { duration: 0.8 })
    }
  }, [focusedVehicle, map])
  return null
}

// ── Hover tooltip popup ───────────────────────────────────────────────────────
const VehicleTooltipContent = ({ v }) => `
  <div style="font-family:Inter,sans-serif;min-width:160px">
    <div style="font-weight:700;font-size:12px;color:#1e293b;margin-bottom:2px">${v.name}</div>
    <div style="font-size:10px;color:#64748b;margin-bottom:6px">${v.id} · ${v.plate}</div>
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
      <span style="font-size:10px;color:#64748b">Driver:</span>
      <span style="font-size:10px;font-weight:600;color:#1e293b">${v.driver?.name || '—'}</span>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">
      <span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:5px;background:${v.status==='Moving'?'#d1fae5':'#fef3c7'};color:${v.status==='Moving'?'#065f46':'#92400e'}">${v.status}</span>
      ${v.speed > 0 ? `<span style="font-size:9px;font-weight:700;padding:2px 6px;border-radius:5px;background:#eff6ff;color:#1d4ed8">${v.speed} km/h</span>` : ''}
      ${v.vitals?.fuel !== undefined ? `<span style="font-size:9px;padding:2px 6px;border-radius:5px;background:#f8fafc;color:#64748b">⛽ ${v.vitals.fuel}%</span>` : ''}
    </div>
    <p style="font-size:9px;color:#94a3b8;margin-top:6px">Double-click for full details</p>
  </div>
`

// ── Main map component ────────────────────────────────────────────────────────
const MonitorMap = ({ vehicles, focusedVehicle, selectedVehicle, onSingleClick, onDoubleClick }) => {
  const center = [56.1629, 10.2039]
  const markersRef = useRef({})

  return (
    <MapContainer
      center={center}
      zoom={9}
      style={{ width: '100%', height: '100%' }}
      doubleClickZoom={false}
      zoomControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        maxZoom={19}
      />

      <DisableDoubleClickZoom />
      <MapController focusedVehicle={focusedVehicle} />

      {vehicles.slice(0, 120).map(v => {
        const isFocused  = focusedVehicle?.id  === v.id
        const isSelected = selectedVehicle?.id === v.id
        const icon = createMarkerIcon(v.status, isFocused, isSelected)

        return (
          <Marker
            key={v.id}
            position={[v.lat, v.lng]}
            icon={icon}
            eventHandlers={{
              click:     () => onSingleClick(v),
              dblclick:  () => onDoubleClick(v),
              mouseover: (e) => {
                e.target.bindTooltip(VehicleTooltipContent({ v }), {
                  direction: 'top',
                  offset: [0, -16],
                  className: 'monitor-tooltip',
                  permanent: false,
                }).openTooltip()
              },
              mouseout: (e) => e.target.closeTooltip(),
            }}
          />
        )
      })}
    </MapContainer>
  )
}

export default MonitorMap
