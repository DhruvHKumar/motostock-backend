import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { AlertTriangle } from 'lucide-react';
import { CATEGORIES } from '../constants';

// Custom Marker Icon
const createCustomIcon = (isCritical) => {
    return L.divIcon({
        className: 'custom-marker-icon',
        html: `<div class="marker-pin ${isCritical ? 'critical' : ''}"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -35]
    });
};

const GeoDashboard = ({ data, rawCities }) => {
    // Center of India
    const center = [22.5937, 78.9629];

    // Aggregate data by city for the map
    const cityData = useMemo(() => {
        // 1. Get unique cities from the data
        const uniqueCities = [...new Set(data.map(d => d.city))];

        const cities = uniqueCities.map(cityName => {
            // Find coordinates from RAW_CITIES or use a default/fallback
            const cityInfo = rawCities.find(c => c.name === cityName);

            if (!cityInfo) {
                console.warn(`City not found in coordinate list: ${cityName}. Skipping map placement.`);
                return null; // Return null to filter out later
            }

            // Get all items for this city
            const cityStock = data.filter(d => d.city === cityName);
            const totalStock = cityStock.reduce((acc, curr) => acc + curr.stock, 0);
            const lowStockItems = cityStock.filter(d => d.stock < 30);
            const isCritical = lowStockItems.length > 0;

            // Aggregate stock by category for the popup
            const categoryStats = CATEGORIES.map(cat => {
                const catStock = cityStock.filter(d => d.category === cat.id).reduce((acc, curr) => acc + curr.stock, 0);
                return { label: cat.label, stock: catStock, id: cat.id };
            }).filter(c => c.stock > 0);

            return {
                name: cityName,
                lat: cityInfo.lat,
                lng: cityInfo.lng,
                totalStock,
                isCritical,
                details: cityStock,
                categoryStats
            };
        }).filter(city => city !== null); // Filter out nulls (cities without coordinates)

        // Group cities by location to detect overlaps
        const locationGroups = cities.reduce((acc, city) => {
            const key = `${city.lat.toFixed(2)},${city.lng.toFixed(2)}`;
            if (!acc[key]) acc[key] = [];
            acc[key].push(city);
            return acc;
        }, {});

        // Add small offset to overlapping markers
        return cities.map(city => {
            const key = `${city.lat.toFixed(2)},${city.lng.toFixed(2)}`;
            const group = locationGroups[key];

            if (group.length > 1) {
                const index = group.indexOf(city);
                // Add small circular offset
                const angle = (index / group.length) * Math.PI * 2;
                const offset = 0.15; // degrees offset
                return {
                    ...city,
                    lat: city.lat + Math.cos(angle) * offset,
                    lng: city.lng + Math.sin(angle) * offset,
                    isGrouped: true,
                    groupCount: group.length
                };
            }

            return city;
        });
    }, [data, rawCities]);

    return (
        <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {cityData.map((city, idx) => (
                <Marker
                    key={idx}
                    position={[city.lat, city.lng]}
                    icon={createCustomIcon(city.isCritical)}
                >
                    <Popup className="custom-popup">
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2 mb-2">{city.name}</h3>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs text-slate-500 uppercase font-semibold">Total Stock</span>
                                <span className="font-bold text-[#005696]">{city.totalStock}</span>
                            </div>

                            {city.isCritical && (
                                <div className="bg-red-50 border border-red-100 rounded p-2 mb-2">
                                    <p className="text-xs text-red-600 font-bold flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Critical Items
                                    </p>
                                    <ul className="mt-1 space-y-1 max-h-24 overflow-y-auto">
                                        {city.details.filter(d => d.stock < 30).map((d, i) => (
                                            <li key={i} className="text-[10px] text-red-500 flex justify-between">
                                                <span className="truncate max-w-[100px]" title={d.item}>{d.item}</span>
                                                <span className="font-mono">{d.stock}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="space-y-1">
                                <p className="text-[10px] text-slate-400 uppercase font-bold">Category Breakdown</p>
                                {city.categoryStats.map((cat, i) => (
                                    <div key={i} className="flex justify-between text-xs text-slate-600">
                                        <span>{cat.label}</span>
                                        <span className="font-medium text-slate-700">{cat.stock}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default GeoDashboard;
