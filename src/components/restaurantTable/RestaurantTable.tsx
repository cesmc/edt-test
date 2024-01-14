import { useState } from 'react';
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
}

const RestaurantTable: React.FC<RestaurantTableProps> = ({ restaurantsData }) => {
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    setSortBy((prevSortBy) => (prevSortBy === key ? `-${key}` : key));
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const sortedData = sortBy
  ? [...restaurantsData].sort((a, b) => {
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
  : restaurantsData;

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
        {sortedData.map((restaurant) => (
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