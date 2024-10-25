import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App'
import New from './new';
import Test from './test';

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
        <Route path="/new" element={<New />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
}
if (history.scrollRestoration) {
  history.scrollRestoration = 'manual';
}
createRoot(document.getElementById('root')!).render(
  <Main />
)