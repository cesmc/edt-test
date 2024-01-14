import { useState, useEffect } from 'react';
import './style.css'

interface Restaurant {
  id: string;
  rating: number;
  name: string;
  contact: {
    site: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    location: {
      lat: number;
      lng: number;
    };
    actualKey: Array<number>;
  };
}

interface RestaurantTableProps {
  restaurantsData: Restaurant[];
  selectedPoint: number[];
  radius: number;
}

const RestaurantTable: React.FC<RestaurantTableProps> = ({ restaurantsData, selectedPoint, radius }) => {
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(restaurantsData);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    setSortBy((prevSortBy) => (prevSortBy === key ? `-${key}` : key));
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  useEffect(() => {
    const filterRestaurants = () => {
      const filtered = restaurantsData.filter((restaurant) => {
        const distance = calculateDistance(
          selectedPoint[0],
          selectedPoint[1],
          restaurant.address.location.lat,
          restaurant.address.location.lng
        );
        return distance <= radius;
      });
      const sorted = sortRestaurants(filtered);
      setFilteredRestaurants(sorted);
    };

    filterRestaurants();
  }, [selectedPoint, radius, restaurantsData, sortBy]);

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

  const sortRestaurants = (data: Restaurant[]) => {
    return sortBy
      ? [...data].sort((a, b) => {
          const isDescending = sortBy.startsWith('-');
          const actualKey = isDescending ? sortBy.slice(1) : sortBy;

          const aValue = a[actualKey];
          const bValue = b[actualKey];

          if (typeof aValue === 'number' && typeof bValue === 'number') {
            return isDescending ? bValue - aValue : aValue - bValue;
          } else {
            return isDescending ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
          }
        })
      : data;
  };

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th className="sort-button" onClick={() => handleSort('name')}>
            Nombre {sortBy?.includes('name') && (sortOrder === 'asc' ? '▲' : '▼')}
          </th>
          <th>Contacto</th>
          <th>Dirección</th>
          <th className="sort-button" onClick={() => handleSort('rating')}>
            Rating {sortBy?.includes('rating') && (sortOrder === 'asc' ? '▲' : '▼')}
          </th>
        </tr>
      </thead>
      <tbody>
        {filteredRestaurants.map((restaurant) => (
          <tr key={restaurant.id}>
            <td>{restaurant.id}</td>
            <td>{restaurant.name}</td>
            <td>
              <a href={restaurant.contact.site} target="_blank" rel="noopener noreferrer">
                {restaurant.contact.site}
              </a>
              <br />
              {restaurant.contact.email}
              <br />
              {restaurant.contact.phone}
            </td>
            <td>
              {restaurant.address.street}, {restaurant.address.city}, {restaurant.address.state}
              <br />
              {restaurant.address.location.lat}
              {restaurant.address.location.lng}
            </td>
            <td>{restaurant.rating}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RestaurantTable;
