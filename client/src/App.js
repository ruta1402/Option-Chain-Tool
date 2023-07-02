import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Socket from './pages/Socket';
import SocketClient from './components/SocketClient';

function App() {
  return (
    <div className="App">
     <Home/>
     <SocketClient/>
    </div>
  );
}

export default App;
