import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Xox from './Pages/Games/Xox'
import NumberBox from './Pages/Games/NumberBox'
import Raycasting2d from './Pages/Games/Raycasting2D'

function App() {

  return (<BrowserRouter>
      <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/games/xox' element={<Xox/>} />
          <Route path='/games/number-box' element={<NumberBox/>} />
          <Route path='/games/2d-raycasting' element={<Raycasting2d/>} />
      </Routes>
  </BrowserRouter>)
}

export default App
