"use client";

import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { Business, MapFocus } from "./opportunity-map";

const HOME: [number, number] = [24.55, 54.9];
type MapLanguage = "en" | "ar";
const LANGUAGE_KEY = "nefe-map-language";
const tileLayers: Record<MapLanguage, { url: string; attribution: string }> = {
  en: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  ar: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
  },
};

function Controls({ focus, onZoom }: { focus: MapFocus; onZoom: (zoom: number) => void }) {
  const map = useMap();
  useEffect(() => {
    if (focus.home) map.flyTo(HOME, 7, { duration: 1.1 });
    else map.flyTo(focus.center, focus.zoom, { duration: 1.1 });
  }, [focus, map]);
  useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  return <div className="leaflet-nefe-controls">
    <button onClick={() => map.zoomIn()} aria-label="Zoom in">+</button>
    <button onClick={() => map.zoomOut()} aria-label="Zoom out">−</button>
    <button onClick={() => map.flyTo(HOME, 7, { duration: 1.1 })} aria-label="Reset map">⌂</button>
  </div>;
}

function iconFor(business: Business, active: boolean) {
  return L.divIcon({
    className: "nefe-leaflet-icon",
    iconSize: business.ceo ? [48, 58] : [40, 48],
    iconAnchor: business.ceo ? [24, 49] : [20, 41],
    html: `<div class="leaflet-pin ${business.ceo ? "ceo" : ""} ${active ? "selected" : ""}"><span>${business.initials}</span>${business.ceo ? `<b>CEO Network</b><em>${business.name}</em>` : `<i>${business.fit}%</i>`}</div>`,
  });
}

export default function LeafletMap({ businesses, selected, focus, onSelect, onHover, onZoom }: {
  businesses: Business[];
  selected: Business;
  focus: MapFocus;
  onSelect: (business: Business) => void;
  onHover: (business: Business | null) => void;
  onZoom: (zoom: number) => void;
}) {
  const [tileError, setTileError] = useState(false);
  const [language, setLanguage] = useState<MapLanguage>(() => {
    if (typeof window === "undefined") return "en";
    const saved = window.sessionStorage.getItem(LANGUAGE_KEY);
    return saved === "en" || saved === "ar" ? saved : "en";
  });
  const changeLanguage = (next: MapLanguage) => {
    setLanguage(next);
    setTileError(false);
    window.sessionStorage.setItem(LANGUAGE_KEY, next);
  };
  const connections = useMemo(() => businesses.slice(0, 24).map((business, index) => {
    const target = businesses[(index + 3) % businesses.length];
    return target ? [[business.lat, business.lng], [target.lat, target.lng]] as [[number, number], [number, number]] : null;
  }).filter(Boolean) as [[number, number], [number, number]][], [businesses]);
  const tiles = tileLayers[language];

  return <div className="relative h-[680px] overflow-hidden rounded-[25px]">
    <MapContainer center={HOME} zoom={7} minZoom={6} maxZoom={16} zoomControl={false} scrollWheelZoom className="h-full w-full">
      <TileLayer
        key={language}
        attribution={tiles.attribution}
        url={tiles.url}
        eventHandlers={{ tileerror: () => setTileError(true), load: () => setTileError(false) }}
      />
      <Controls focus={focus} onZoom={onZoom} />
      {connections.map((positions, index) => <Polyline key={index} positions={positions} pathOptions={{ color: "#7655df", weight: 1.2, opacity: .3, dashArray: "5 8" }} />)}
      {businesses.map(business => <Marker
        key={business.name}
        position={[business.lat, business.lng]}
        icon={iconFor(business, selected.name === business.name)}
        zIndexOffset={business.ceo ? 1000 : selected.name === business.name ? 500 : 0}
        eventHandlers={{
          click: () => onSelect(business),
          mouseover: () => onHover(business),
          mouseout: () => onHover(null),
        }}
      >
        <Tooltip direction="top" offset={[0, -42]} className={`business-map-tooltip ${business.ceo ? "ceo-business-tooltip" : ""}`}>
          <div className="map-tooltip-card">
            <div className="flex items-start justify-between gap-4">
              <div><strong>{business.name}</strong><small>{business.category} · {business.location}</small></div>
              <b>{business.ceo ? "CEO Network" : `${business.fit}% fit`}</b>
            </div>
            <div className="map-tooltip-metrics">
              <span>{business.referrals}<i>Monthly referrals</i></span>
              <span>{business.nearby}<i>Nearby partners</i></span>
              <span>AED {(business.value / 1000).toFixed(0)}K<i>Monthly value</i></span>
            </div>
            <p>{business.bundle}</p>
          </div>
        </Tooltip>
      </Marker>)}
    </MapContainer>
    <label className="leaflet-language-control">
      <span><i aria-hidden="true">◎</i> Map Language</span>
      <select value={language} onChange={event => changeLanguage(event.target.value as MapLanguage)} aria-label="Map Language">
        <option value="en">🇬🇧 English</option>
        <option value="ar">🇦🇪 العربية</option>
      </select>
    </label>
    {tileError && <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[1000] rounded-xl border border-[#D7C9A2] bg-[#FFF9E8]/95 px-4 py-3 text-[8px] text-[#795F28] shadow-lg backdrop-blur">Map tiles are temporarily unavailable. Business intelligence and marker interactions remain active.</div>}
  </div>;
}
