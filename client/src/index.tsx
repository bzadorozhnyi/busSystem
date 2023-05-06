import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './pages/home/Home';

import AddBus from './pages/buses/AddBus';
import BusComponent from './pages/buses/BusComponent/BusComponent';
import BusList from './pages/buses/BusList';

import AddCarrierCompany from './pages/carrierCompanies/AddCarrierCompany';
import CarrierCompanyList from './pages/carrierCompanies/CarrierCompanyList';
import CarrierCompanyComponent from './pages/carrierCompanies/CarrierCompanyComponent/CarrierCompanyComponent';

import AddDriver from './pages/drivers/AddDriver';
import DriverList from './pages/drivers/DriverList';
import DriverComponent from './pages/drivers/DriverComponent/DriverComponent';

import AddBuyer from './pages/buyers/AddBuyer';
import BuyerList from './pages/buyers/BuyerList';
import BuyerComponent from './pages/buyers/BuyerComponent/BuyerComponent';

import AddFlight from './pages/flights/AddFlight';
import FlightList from './pages/flights/FlightList';
import FlightComponent from './pages/flights/FlightComponent';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import AddTickets from './pages/tickets/addTickets';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<PageNotFound />} />

        <Route path='/' element={<Home />} />

        <Route path='/add/bus' element={<AddBus />} />
        <Route path='/bus/:busNumber' element={<BusComponent />} />
        <Route path='/buses' element={<BusList />} />

        <Route path='/add/carrier_company' element={<AddCarrierCompany />} />
        <Route path='/carrier_companies' element={<CarrierCompanyList />} />
        <Route path='/carrier_company/:id' element={<CarrierCompanyComponent />} />

        <Route path='/add/driver' element={<AddDriver />} />
        <Route path='/drivers' element={<DriverList />} />
        <Route path='/driver/:id' element={<DriverComponent />} />
        
        <Route path='/add/buyer' element={<AddBuyer />} />
        <Route path='/buyers' element={<BuyerList />} />
        <Route path='/buyer/:id' element={<BuyerComponent />} />
        
        <Route path='/add/flight' element={<AddFlight />} />
        <Route path='/flights' element={<FlightList />} />
        <Route path='/flight/:id' element={<FlightComponent />} />
        
        <Route path='/add/tickets/:id' element={<AddTickets />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
