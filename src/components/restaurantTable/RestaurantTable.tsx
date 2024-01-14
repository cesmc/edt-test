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
  };
}

interface RestaurantTableProps {
  restaurantsData: Restaurant[];
}

const RestaurantTable: React.FC<RestaurantTableProps> = ({ restaurantsData }) => {
  const [sortBy, setSortBy] = useState<string | null>(null);

  const handleSort = (key: string) => {
    setSortBy(key);
  };

  const sortedData = sortBy ? [...restaurantsData].sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1)) : restaurantsData;

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th onClick={() => handleSort('name')}>Nombre</th>
          <th>Contacto</th>
          <th>Dirección</th>
          <th onClick={() => handleSort('rating')}>Rating</th>
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