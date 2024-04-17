import { Route, Routes } from "react-router-dom"
import Pocetna from "./pages/Pocetna"
import { RoutesNames } from "./constants"
import NavBar from "./components/NavBar"

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Tecajevi from "./pages/tecajevi/Tecajevi"
import TecajeviDodaj from "./pages/tecajevi/TecajeviDodaj"
import TecajeviPromjeni from "./pages/tecajevi/TecajeviPromjeni"

import Instruktori from "./pages/instruktori/Instruktori"
import InstruktoriDodaj from "./pages/instruktori/InstruktoriDodaj"
import InstruktoriPromjeni from "./pages/instruktori/InstruktoriPromjeni"

import Kandidati from "./pages/kandidati/Kandidati"
import KandidatiDodaj from "./pages/kandidati/KandidatiDodaj"
import KandidatiPromjeni from "./pages/kandidati/KandidatiPromjeni"

import Grupe from "./pages/grupe/Grupe"
import GrupeDodaj from "./pages/grupe/GrupeDodaj"
import GrupePromjeni from "./pages/grupe/GrupePromjeni"

import ErrorModal from './components/ErrorModal';
import useError from "./hooks/useError"
import Oznake from "./pages/oznake/Oznake"
import LoadingSpinner from "./components/LoadingSpinner"
import Login from "./pages/Login"
import NadzornaPloca from "./pages/NadzornaPloca"

function App() {
  const { errors, prikaziErrorModal, sakrijError } = useError();
  return (
    <>
      <LoadingSpinner />
      <ErrorModal show={prikaziErrorModal} errors={errors} onHide={sakrijError} />
      <NavBar />
      <Routes>
      <Route path={RoutesNames.HOME} element={<Pocetna />} />
      {isLoggedIn ? (
        <>
          
          <Route path={RoutesNames.NADZORNA_PLOCA} element={<NadzornaPloca />} />
          <Route path={RoutesNames.OZNAKE_PREGLED} element={<Oznake />} />
          
          <Route path={RoutesNames.TECAJEVI_PREGLED} element={<Tecajevi />} />
          <Route path={RoutesNames.TECAJEVI_NOVI} element={<TecajeviDodaj />} />
          <Route path={RoutesNames.TECAJEVI_PROMJENI} element={<TecajeviPromjeni />} />


          <Route path={RoutesNames.INSTRUKTORI_PREGLED} element={<Instruktori />} />
          <Route path={RoutesNames.INSTRUKTORI_NOVI} element={<InstruktoriDodaj />} />
          <Route path={RoutesNames.INSTRUKTORI_PROMJENI} element={<InstruktoriPromjeni />} />

          <Route path={RoutesNames.KANDIDATI_PREGLED} element={<Kandidati />} />
          <Route path={RoutesNames.KANDIDATI_NOVI} element={<KandidatiDodaj />} />
          <Route path={RoutesNames.KANDIDATI_PROMJENI} element={<KandidatiPromjeni />} />

          <Route path={RoutesNames.GRUPE_PREGLED} element={<Grupe />} />
          <Route path={RoutesNames.GRUPE_NOVI} element={<GrupeDodaj />} />
          <Route path={RoutesNames.GRUPE_PROMJENI} element={<GrupePromjeni />} />
        </>
        ) : (
          <>
            <Route path={RoutesNames.LOGIN} element={<Login />} />
          </>
        )}
      </Routes>
    </>
  )
}

export default App
