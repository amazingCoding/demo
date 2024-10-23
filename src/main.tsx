import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App'

// const main = async () => {
//   const asscroll = new ASScroll()
//   window.addEventListener('load', () => {
//     asscroll.enable()
//   })
//   await preloadImagesAsync()
// }
// main()
function Main() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')!).render(
  <Main />
)