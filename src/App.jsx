import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import MaterialDouradoPage from './pages/MaterialDouradoPage'
import MathGamePage from './pages/MathGamePage'
import VowelGamePage from './pages/VowelGamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/jogos/material-dourado" element={<MaterialDouradoPage />} />
      <Route path="/jogos/matematica" element={<MathGamePage />} />
      <Route path="/jogos/vogais" element={<VowelGamePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
