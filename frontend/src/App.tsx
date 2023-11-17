import React from 'react';
import {WebcamCapture} from "./components/Webcam"
import LandingPage from './components/LandingPage';
import {Footer} from './components/Footer';
import {Container} from './components/Container';
import './App.css';
import './index.css'


function App() {
  return (
    <div className="mainApp">
      <LandingPage />
      <Container/>
      <WebcamCapture/>
      <Footer/>
    </div>
  );
}

export default App;
