import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import { EVENT_META } from "../lib/api";

const SEV_COLOR = { CRITICAL: "#EF4444", HIGH: "#F97316", MEDIUM: "#F59E0B", LOW: "#3B82F6" };

function eventIcon(ev) {
  const meta = EVENT_META[ev.type] || {};
  const color = SEV_COLOR[ev.severity] || meta.color || "#3B82F6";
  const pulse = ["CRITICAL", "HIGH"].includes(ev.severity);
  return L.divIcon({
    className: "",
    html: `<div style="position:relative">
      ${pulse ? `<span class="rp-ping" style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:0.5"></span>` : ""}
      <span class="rp-marker" style="display:block;width:14px;height:14px;background:${color}"></span>
    </div>`,
    iconSize: [14, 14], iconAnchor: [7, 7],
  });
}

function busIcon(bus) {
  const online = bus.status === "ONLINE";
  return L.divIcon({
    className: "",
    html: `<div class="rp-bus-marker" style="width:26px;height:20px;background:${online ? "#3B82F6" : "#64748B"}">
      ${bus.id.replace("BUS-", "")}</div>`,
    iconSize: [26, 20], iconAnchor: [13, 10],
  });
}

/**
 * Imperative Leaflet map. props:
 *  center, events[], buses[], routes[], roads[], heat[], coverage[]
 *  onEventClick(ev), fitBounds(bool)
 */
export default function MapView({
  center = [13.0604, 80.2496], zoom = 12,
  events = [], buses = [], routes = [], roads = [], heat = [], coverage = [],
  onEventClick, className = "", testid = "map-view",
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const layersRef = useRef({});

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView(center, zoom);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19, attribution: "© OpenStreetMap",
    }).addTo(map);
    mapRef.current = map;
    layersRef.current = {
      routes: L.layerGroup().addTo(map),
      roads: L.layerGroup().addTo(map),
      heat: L.layerGroup().addTo(map),
      coverage: L.layerGroup().addTo(map),
      cluster: L.markerClusterGroup({ maxClusterRadius: 42, chunkedLoading: true }).addTo(map),
      buses: L.layerGroup().addTo(map),
    };
    setTimeout(() => map.invalidateSize(), 200);
    return () => { map.remove(); mapRef.current = null; };
  }, []); // eslint-disable-line

  // routes
  useEffect(() => {
    const g = layersRef.current.routes; if (!g) return; g.clearLayers();
    routes.forEach((r) => {
      if (r.geometry?.length) L.polyline(r.geometry, { color: "#3B82F6", weight: 2, opacity: 0.35 }).addTo(g);
    });
  }, [routes]);

  // roads (health)
  useEffect(() => {
    const g = layersRef.current.roads; if (!g) return; g.clearLayers();
    const bandColor = { HEALTHY: "#10B981", GOOD: "#84CC16", DEGRADED: "#F59E0B", POOR: "#F97316", CRITICAL: "#EF4444" };
    roads.forEach((s) => {
      if (s.geometry?.length) {
        L.polyline(s.geometry, { color: bandColor[s.health_band] || "#64748B", weight: 5, opacity: 0.8 })
          .bindPopup(`<b>${s.name}</b><br/>Health: ${s.health_score}/100 (${s.health_band})<br/>Defects: ${s.defect_count}`)
          .addTo(g);
      }
    });
  }, [roads]);

  // heat / coverage circles
  useEffect(() => {
    const g = layersRef.current.heat; if (!g) return; g.clearLayers();
    heat.forEach((h) => {
      L.circle([h.latitude, h.longitude], {
        radius: 500 + h.intensity * 1200, color: "#EF4444", weight: 0,
        fillColor: "#EF4444", fillOpacity: 0.12 + h.intensity * 0.28,
      }).bindPopup(`<b>${h.zone}</b><br/>Congestion: ${Math.round(h.intensity * 100)}%`).addTo(g);
    });
  }, [heat]);

  useEffect(() => {
    const g = layersRef.current.coverage; if (!g) return; g.clearLayers();
    const cc = { HIGH: "#10B981", MEDIUM: "#F59E0B", LOW: "#F97316", NONE: "#EF4444" };
    coverage.forEach((c) => {
      L.circle([c.latitude, c.longitude], {
        radius: 700, color: cc[c.coverage], weight: 1,
        fillColor: cc[c.coverage], fillOpacity: 0.18,
      }).bindPopup(`<b>${c.name}</b><br/>${c.coverage} coverage<br/>${c.observation_count} observations`).addTo(g);
    });
  }, [coverage]);

  // events cluster
  useEffect(() => {
    const g = layersRef.current.cluster; if (!g) return; g.clearLayers();
    events.forEach((ev) => {
      if (ev.latitude == null) return;
      const m = L.marker([ev.latitude, ev.longitude], { icon: eventIcon(ev) });
      const meta = EVENT_META[ev.type] || { label: ev.type };
      m.bindPopup(`<b>${meta.label}</b> — ${ev.severity}<br/>${ev.id}<br/>Score ${ev.verification_score}/100 · ${String(ev.status).replace(/_/g," ")}`);
      if (onEventClick) m.on("click", () => onEventClick(ev));
      g.addLayer(m);
    });
  }, [events]); // eslint-disable-line

  // buses
  useEffect(() => {
    const g = layersRef.current.buses; if (!g) return; g.clearLayers();
    buses.forEach((b) => {
      if (b.latitude == null) return;
      L.marker([b.latitude, b.longitude], { icon: busIcon(b) })
        .bindPopup(`<b>${b.id}</b> · Route ${b.route_code}<br/>${b.status} · ${b.speed} km/h`)
        .addTo(g);
    });
  }, [buses]);

  return <div ref={containerRef} data-testid={testid} className={`w-full h-full ${className}`} style={{ minHeight: 300 }} />;
}

