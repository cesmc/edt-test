import axios from '../node_modules/axios/index';
import { useEffect, useState } from 'react'
import RestaurantTable from './components/restaurantTable/RestaurantTable';
import './App.css'

interface Restaurant {
  name: string;
  address: string;
}

const URL = "https://recruiting-datasets.s3.us-east-2.amazonaws.com/data_melp.json"

function App() {
  const [restaurantsData, setRestaurantsData] = useState<Restaurant[]>([]);
  
  const fetchData = () => {
    axios.get(URL)
    .then((response) => response.data)
    .then((res) => {
      setRestaurantsData(res);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  };

  useEffect(() => {
    fetchData();
  }, [])

  console.log('ooo restaurants', restaurantsData)
  return (
    <>
      <h1>TEST - EDT</h1>
      <RestaurantTable restaurantsData={restaurantsData}/>
    </>
  )
}

export default App
