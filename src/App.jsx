import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Xox from './Pages/Games/Xox'

function App() {

  return (<BrowserRouter>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/games/xox' element={<Xox/>} />
      </Routes>
  </BrowserRouter>)
}

export default App
