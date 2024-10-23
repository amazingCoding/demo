

import { useEffect, useRef, useState } from 'react'
import { drawFrame, imgs } from './action'
import video1 from './assets/1.mp4'
import heroImage from './assets/hero.jpg'
import video2 from './assets/2.mp4'
import ASScroll from '@ashthornton/asscroll'
import sec_2_image from './assets/sec_2.png'
import logo from './assets/logo.png'
const fps = 120; // 设置目标帧率
const interval = 1000 / fps;

function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const [progress, setProgress] = useState<number>(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentFrame = useRef<number>(0)
  const lastFrame = useRef<number>(0)
  const isPause = useRef<boolean>(true)
  // const isReverse = useRef<boolean>(false)
  const timer = useRef<any | null>(null)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const asscrollRef = useRef<ASScroll | null>(null)
  const isPlaying = useRef<boolean>(false)
  const lastTime = useRef<number>(0)
  useEffect(() => {
    preload()
    return () => {
      timer.current && clearInterval(timer.current)
    }
  }, [])
  useEffect(() => {
    if (!loading) {
      init()
    }
  }, [loading])
  const preload = async () => {
    let count = 0
    const max = imgs.length
    const callback = (isSuccess: boolean) => {
      if (isSuccess) {
        setLoading(false)
        setProgress(1)
      }
      // 加载图片
      const images: HTMLImageElement[] = []
      for (let i = 0; i < imgs.length; i++) {
        const img = new Image()
        img.src = imgs[i]
        images.push(img)
      }
      imagesRef.current = images
    }
    for (let i = 0; i <= max; i++) {
      const img = new Image()
      img.src = i === max ? heroImage : imgs[i]
      img.onload = () => {
        count++
        // 计算进度 1 为全部加载完成
        setProgress(count / max)
        if (count === max) {
          console.log('all images loaded')
          callback(true)
        }
      }
      img.onerror = () => {
        console.error(`img ${i} load failed`)
        callback(false)
        return
      }
    }
  }
  const init = async () => {
    // 初始化 asscroll
    const asscrollContainer = document.getElementById('asscroll-container')
    if (asscrollContainer) {
      asscrollContainer.setAttribute('asscroll-container', 'true')
      const asscroll = new ASScroll({
        scrollElements: asscrollContainer,
        // ease: 0.1,
        // touchEase: 1,
        disableRaf: true,
        lockIOSBrowserUI: true

      })
      window.addEventListener('load', () => {
        asscroll.enable({
          restore: true
        })
      })
      asscrollRef.current = asscroll
      const video1 = document.getElementById('video1') as HTMLVideoElement
      const video2 = document.getElementById('video2')! as HTMLVideoElement
      const section2Title = document.getElementById('section-2-title')
      const section2Content = document.getElementById('section-2-content')
      if (video1.paused) {
        document.body.addEventListener('click', () => {
          if (video1.paused) {
            video1.play()
            video2.pause()
            // 首次播放之后删除事件
            document.body.removeEventListener('click', () => { })
          }
        })
      }
      // 监听滚动
      asscrollRef.current.on('scroll', (e: any) => {
        console.log(e)
        const headerHeight = document.getElementById('header')!.clientHeight
        const windowHeight = window.innerHeight

        // 在 0 ～ h-screen 之间
        if (e >= 0 && e <= windowHeight) {
          // 如果没有播放，则播放
          if (video1.paused) {
            video1.play()
          }
          // section-bg 的背景色，跟随滚动 0～0.6
          const sectionBg = document.getElementById('section-bg')
          if (sectionBg) {
            // max 0.6  min 0
            const opacity = e / windowHeight * 0.6
            sectionBg.style.backgroundColor = `rgba(0,0,0,${opacity})`
          }
          // document.getElementById('logo')! 的 filter 跟随滚动 0～100%
          const logo = document.getElementById('logo')!
          if (e > windowHeight / 2) {
            if (logo) {
              const p = (e - windowHeight / 2) / (windowHeight / 2)
              logo.style.filter = `invert(${p * 100}%)`
            }
          }
          // section1.style.transform = `translateY(${e}px)`
        }
        else {
          if (!video1.paused) {
            video1.pause()
          }
        }
        if (e >= windowHeight - headerHeight && e <= windowHeight * 2) {
          if (video2.paused) {
            video2.play()
          }
        }
        else {
          if (!video2.paused) {
            video2.pause()
          }
        }
        if (e >= windowHeight / 3) {
          const section2Title = document.getElementById('section-2-title')
          if (section2Title) {
            section2Title.classList.add('move-up-and-fade-in')
            section2Title.classList.remove('move-up-and-fade-out')
          }
          const section2Content = document.getElementById('section-2-content')
          if (section2Content) {
            section2Content.classList.add('move-up-and-fade-in')
            section2Content.classList.remove('move-up-and-fade-out')
          }
        }
        else {
          section2Title?.classList.remove('move-up-and-fade-in')
          section2Content?.classList.remove('move-up-and-fade-in')
          section2Title?.classList.add('move-up-and-fade-out')
          section2Content?.classList.add('move-up-and-fade-out')
        }
        // 从 windowHeight *2 到  windowHeight *3 之间，绘制 canvas
        if (e >= windowHeight * 1.5 && e <= windowHeight * 3.5) {
          // 先暂停动画，然后读取到当前 e ，获取对应的 frame ，然后从当前 frame 逐帧绘制 33 ms 一张
          const ctx = canvasRef.current?.getContext('2d')
          if (ctx) {
            const currentPos = (e - windowHeight * 1.5) / (windowHeight * 2)
            const currentFrame = Math.floor(currentPos * imagesRef.current.length)
            lastFrame.current = currentFrame
          }
        }
        if (e >= windowHeight * 1.5 && e <= windowHeight * 5) {
          // 先展示 canvasRef 
          canvasRef.current!.style.display = 'block'
        }
        else {
          const ctx = canvasRef.current?.getContext('2d')
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
          }
          lastFrame.current = 0
          currentFrame.current = 0
          canvasRef.current!.style.display = 'none'
        }
      })
    }
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvasRef.current!.width = canvasRef.current!.width * devicePixelRatio;
    canvasRef.current!.height = canvasRef.current!.height * devicePixelRatio;
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    }
    const animate = (timestamp: number) => {
      if (timestamp - lastTime.current >= interval) {
        lastTime.current = timestamp;
        asscrollRef.current?.update()
        if (isPause.current) {
        }
        if (currentFrame.current === lastFrame.current) {
          isPlaying.current = false
        }
        else {
          isPlaying.current = true
        }
        if (isPlaying.current) {
          drawFrame(ctx!, imagesRef.current[currentFrame.current])
          if (currentFrame.current > lastFrame.current) {
            currentFrame.current--
          }
          else {
            currentFrame.current++
          }
        }
      }
      requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }
  return (
    loading ?
      <div className='w-full h-full flex justify-center items-center bg-white'>
        <div className='h-[80px] w-[50%] rounded-full flex justify-center items-center border-2 border-black relative overflow-hidden'>
          <div className='w-full h-[78px] bg-red-500 absolute left-0 top-0' style={{ width: `${progress * 100}%` }}></div>
          <img id='logo' src={logo} alt="logo" className="sm:w-[160px] w-[96px]" style={{ filter: 'invert(0%)' }} />
        </div>
      </div> : <div className='w-full h-full absolute top-0 left-0 scale-in-center'>
        <header id='header' className="h-fit fixed top-0 z-[100] left-1/2 -translate-x-1/2 w-full" style={{ backgroundColor: 'transparent' }}>
          <div className="flex justify-between max-w-screen-2xl w-[90vw] sm:w-[85vw] py-8 mx-auto">
            <div className="w-fit" style={{ opacity: 1, willChange: 'transform', transform: 'none' }}>
              <img id='logo' src={logo} alt="logo" className="sm:w-[160px] w-[96px]" style={{ filter: 'invert(0%)' }} />
            </div>
          </div>
        </header>
        <div className='w-full relative bg-transparent relative' id="asscroll-container">
          <div className='w-full'>
            <section className="relative h-screen w-full bg-transparent" id="section-1"  >
              <video playsInline={true} autoPlay={true} muted={true} loop={true}
                id='video1'
                className="h-full w-full object-cover" poster={heroImage}>
                <source src={video1} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div id='section-bg' className='absolute top-0 left-0 w-full h-full'></div>
              <button
                onClick={() => {
                  const browserHeight = window.innerHeight
                  asscrollRef.current?.scrollTo(browserHeight)
                }}
                className="border-2 border-white rounded-full w-[46px] h-[46px] absolute animate-bounce bottom-10 left-1/2 -ml-2 z-10 group">
                <svg className="absolute top-2 left-1/2 -ml-3 text-white h-6 w-6 transition-all duration-300 ease-in-out group-hover:text-black" xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" stroke="currentColor" strokeWidth="0" viewBox="0 0 24 24">
                  <path d="M4.97 13.22a.75.75 0 011.06 0L11 18.19V3.75a.75.75 0 011.5 0v14.44l4.97-4.97a.749.749 0 011.275.326.749.749 0 01-.215.734l-6.25 6.25a.75.75 0 01-1.06 0l-6.25-6.25a.75.75 0 010-1.06z"></path>
                </svg>
                <span className="absolute w-0 h-0 top-1/2 l-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-300 ease-in-out group-hover:w-[46px] group-hover:h-[46px] z-[-1]"></span>
              </button>
            </section>
            <section className="relative h-screen w-full bg-transparent overflow-hidden" id="section-2"  >
              <video playsInline={true} autoPlay={true} muted={true} loop={true}
                id='video2'
                // 如果高度有 
                className="w-full video2 object-cover absolute bottom-0 left-0"
                poster={sec_2_image}>
                <source src={video2} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="flex justify-between flex-col lg:flex-row gap-4 pt-20 md:pt-24 lg:pt-32 max-w-screen-2xl w-[90vw] sm:w-[85vw] mx-auto">
                <div id='section-2-title' className="w-fit" style={{ opacity: 0, willChange: 'transform', transform: 'none' }}>
                  <h1
                    className="text-[50px] md:text-[60px] lg:text-[70px] xl:text-[90px] leading-[65px] sm:leading-[80px] lg:leading-[84px] xl:leading-[131px]  text-balance  tracking-tight">
                    Art Is The Visual <span className="italic font-medium">Proof Of History</span> For Humanity
                  </h1>
                </div>
                <div
                  id='section-2-content'
                  className="w-fit" style={{ opacity: 0, willChange: 'transform', transform: 'none' }}>
                  <p className="text-[16px] leading-[20.4px] sm:text-[20px] sm:leading-[26.2px] lg:pt-20 xl:pt-40 max-w-[820px] w-full">
                    Arttoo is about unlocking a world of possibilities.Become part of a vibrant art community, connect with a
                    timeless piece of culture, and watch your investment grow alongside your passion, with a hassle-free mindset for
                    provenance tracking. All transactions are secure, transparent, and regulated through the beauty of blockchain
                    technologies.</p>
                </div>
              </div>
              {/* <div id='section-bg' className='absolute top-0 left-0 w-full h-full'></div> */}
            </section>
            <div className='w-full bg-transparent'>
              <section className="relative w-full h-screen bg-transparent flex" id="section-3"  >
                <div className="flex-1"></div>
                <div className="flex-1 flex gap-4 items-center justify-center sm:pt-8 lg:pt-16">
                  <span className="text-black/30 text-[40px] italic leading-[52.4px] lg:mt-4">01</span>
                  <div className="flex-1">
                    <h4
                      className="text-[50px] sm:text-[75px] md:text-[100px] text-balance leading-[65px] sm:leading-[100px] md:leading-[131px] italic font-medium">
                      Explore</h4>
                    <p className="text-[16px] leading-[20.4px] md:text-[20px] md:leading-[26.2px]">Browse a collection of iconic masterpieces
                      carefully handpicked by our expert curators from Sotheby's and Christie's.</p>
                  </div>
                </div>
              </section>
              <section className="relative w-full h-screen bg-transparent flex" id="section-4"  >
                <div className="flex-1"></div>
                <div className="flex-1 flex gap-4 items-center justify-center sm:pt-8 lg:pt-16">
                  <span className="text-black/30 text-[40px] italic leading-[52.4px] lg:mt-4">02</span>
                  <div className="flex-1">
                    <h4
                      className="text-[50px] sm:text-[75px] md:text-[100px] text-balance leading-[65px] sm:leading-[100px] md:leading-[131px] italic font-medium">
                      Invest</h4>
                    <p className="text-[16px] leading-[20.4px] md:text-[20px] md:leading-[26.2px]">Browse a collection of iconic masterpieces
                      Start investing in fractional shares of legacy masterpieces with no auction house markups, no gallery markups, no hidden true-up fees.
                    </p>
                  </div>
                </div>
              </section>
              <section className="relative w-full h-screen bg-transparent flex" id="section-5"  >
                <div className="flex-1"></div>
                <div className="flex-1 flex gap-4 items-center justify-center sm:pt-8 lg:pt-16">
                  <span className="text-black/30 text-[40px] italic leading-[52.4px] lg:mt-4">03</span>
                  <div className="flex-1">
                    <h4
                      className="text-[50px] sm:text-[75px] md:text-[100px] text-balance leading-[65px] sm:leading-[100px] md:leading-[131px] italic font-medium">
                      Earn</h4>
                    <p className="text-[16px] leading-[20.4px] md:text-[20px] md:leading-[26.2px]">Earn from your investment with no hidden fees, no auction house markups, no gallery markups, no hidden true-up fees.
                    </p>
                  </div>
                </div>
              </section>

            </div>

          </div>
        </div>
        <canvas width={500} height={500} ref={canvasRef} className='w-[500px] h-[500px] fixed top-[50%] -translate-y-1/2 left-[25%] -translate-x-1/2'></canvas>
      </div>

  )
}

export default App
