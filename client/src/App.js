import logo from './logo.svg';
import './App.css';
import {BrowserRouter,Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import Chat from './components/Chat';
import Login from './components/Login';
import Register from './components/Register';
import Wishlist from './components/Wishlist';
import Upload from './components/Upload';
import Adminhome from './components/Adminhome';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} / >
      <Route path='/chat/:roomId/:currId/:otherId' element={<Chat/>} / >
      <Route path='/login' element={<Login/>} / >
      <Route path='/register' element={<Register/>} / >
      <Route path='/wishlist' element={<Wishlist/>} / >
      <Route path='/create' element={<Upload/>} / >
      <Route path='/adminhome' element={<Adminhome/>} / >
    </Routes>
    </BrowserRouter>
  );
}

export default App;
