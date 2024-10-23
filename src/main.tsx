import { createRoot } from 'react-dom/client'
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

createRoot(document.getElementById('root')!).render(
  <App />
)