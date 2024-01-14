import axios from '../node_modules/axios/index';
import { useEffect, useState } from 'react'
import RestaurantTable from './components/restaurantTable/RestaurantTable';
import MapRadius from './components/mapRadius/MapRadius';
import './App.css'

const URL = "https://recruiting-datasets.s3.us-east-2.amazonaws.com/data_melp.json"

function App() {
  const [restaurantsData, setRestaurantsData] = useState([]);
  const centroMexico = [19.4326, -99.1332];
  const [selectedPoint, setSelectedPoint] = useState(centroMexico);
  const [radius, setRadius] = useState(1500);
  
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

  return (
    <>
      <h1>TEST - EDT</h1>
      <MapRadius 
        selectedPoint={selectedPoint} 
        setSelectedPoint={setSelectedPoint}
        radius={radius}
        setRadius={setRadius}
        centroMexico={centroMexico}
        restaurantsData={restaurantsData}
      />
      <RestaurantTable 
        restaurantsData={restaurantsData}
        selectedPoint={selectedPoint}
        radius={radius}
      />
    </>
  )
}

export default App
