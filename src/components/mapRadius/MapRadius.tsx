import { useRef, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapRadiusProps {
  selectedPoint: number[];
  setSelectedPoint: any;
  radius: number;
  setRadius: any;
  centroMexico: number[];
  restaurantsData: string[];
}

const MapRadius: React.FC<MapRadiusProps> = ({ selectedPoint, setSelectedPoint, radius, setRadius, centroMexico, restaurantsData }) => {
  const mapRef = useRef<MapContainer | null>(null);

  const handleMapClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPoint([e.latlng.lat, e.latlng.lng]);
  };

  const handleRadiusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRadius = parseFloat(event.target.value);
    if (!isNaN(newRadius)) {
      setRadius(newRadius);
    }
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map) {
      map.addEventListener('click', handleMapClick);
    }
    return () => {
      if (map) {
        map.removeEventListener('click', handleMapClick);
      }
    };
  }, [handleMapClick]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3;
  
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c;
  
    return distance;
  };
  
  const toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };

  return (
    <div>
      <MapContainer center={centroMexico} zoom={6} style={{ height: '500px', width: '100%' }} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={selectedPoint}>
          <Popup>
            Punto seleccionado: <br /> {`${selectedPoint[0]}, ${selectedPoint[1]}`}
          </Popup>
        </Marker>
        <Circle center={selectedPoint} radius={radius} />
        {restaurantsData.map((restaurant) => {
          const distance = calculateDistance(
            selectedPoint[0],
            selectedPoint[1],
            restaurant.address.location.lat,
            restaurant.address.location.lng
          );
          if (distance <= radius) {
            return (
              <Marker key={restaurant.id} position={[restaurant.address.location.lat, restaurant.address.location.lng]}>
                <Popup>
                  {restaurant.name} <br />
                  {`${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}`}
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
      <div>
      <label htmlFor="radiusInput">Radio (metros): </label>
      <input
        type="number"
        id="radiusInput"
        value={radius}
        onChange={handleRadiusChange}
      />
    </div>
  </div>
  );
}

export default MapRadius
