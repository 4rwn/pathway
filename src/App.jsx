import Header from './Header/Header.jsx'
import {Title, Game} from './Game/Game.jsx'
import Dashboard from './Dashboard/Dashboard.jsx'

import big5 from './icons/big5.png';
import emotions from './icons/emotions.png';
import helicopter from './icons/helicopter.png';
import interests from './icons/interests.png';

function App() {

  return(
    <>
      <Header/>
      <Dashboard/>      
      <Title/>
      <Game gameName="Big Five Test"      estTime="20"    image={big5}/>
      <Game gameName="Interessen"         estTime="25"    image={interests}/>
      <Game gameName="Helicopter Game"    estTime="15"    image={helicopter}/>
      <Game gameName="Emotionen"          estTime="30"    image={emotions}/>
    </>
  );
}

export default App
