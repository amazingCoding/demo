import { useEffect, useRef } from "react";
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
// const Test = () => {
//   const isFirstRef = useRef(true)
//   // https://demo-oimq.vercel.app/assets/1-DymY1hbp.mp4
//   useEffect(() => {
//     if (isMobile) return
//     init()
//     // const video = document.createElement('video');
//     // video.src = 'https://demo-oimq.vercel.app/assets/1-DymY1hbp.mp4';
//     // video.play();
//     // 初始化 Three.js 场景、相机和渲染器
//   }, []);
//   const init = () => {
//     isFirstRef.current = false
//     const THREE = window.THREE
//     const scene = new THREE.Scene();
//     const container = document.getElementById('canvas') as HTMLDivElement;
//     const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer();
//     renderer.setSize(container.clientWidth, container.clientHeight);
//     container.appendChild(renderer.domElement);

//     // 设置相机位置
//     camera.position.z = 1;

//     // 创建几何体，稍后我们会将视频作为纹理应用到这个几何体上，尺寸为 container 的宽高
//     const geometry = new THREE.PlaneGeometry(1, 1);

//     fetch('https://demo-oimq.vercel.app/assets/1-DymY1hbp.mp4')
//       .then(res => res.blob())
//       .then(blob => {
//         // video.src = URL.createObjectURL(blob);
//         // video.play();
//         console.log('start')
//         const video = document.createElement('video');
//         video.src = URL.createObjectURL(blob); // 将 Blob 作为视频源
//         video.muted = true; // 静音以便自动播放
//         video.playsInline = true; // 防止视频全屏播放
//         video.loop = true; // 视频循环播放
//         video.play(); // 开始播放视频
//         // 调整几何体大小以实现 cover 效果
//         function resizeCover() {
//           const videoAspect = video.videoWidth / video.videoHeight; // 视频宽高比
//           const windowAspect = container.clientWidth / container.clientHeight; // 窗口宽高比

//           if (windowAspect > videoAspect) {
//             // 窗口比较宽，调整几何体的宽度
//             plane.scale.set(windowAspect / videoAspect, 1, 1);
//           } else {
//             // 窗口比较高，调整几何体的高度
//             plane.scale.set(1, videoAspect / windowAspect, 1);
//           }
//         }

//         // 监听视频加载元数据事件，以便在获取视频宽高后调整比例
//         video.addEventListener('loadedmetadata', () => {
//           resizeCover();
//         });
//         // 创建 VideoTexture 并应用到几何体的材质上
//         const videoTexture = new THREE.VideoTexture(video);
//         videoTexture.minFilter = THREE.LinearFilter;
//         videoTexture.magFilter = THREE.LinearFilter;
//         videoTexture.format = THREE.RGBFormat;

//         const material = new THREE.MeshBasicMaterial({ map: videoTexture });
//         const plane = new THREE.Mesh(geometry, material);
//         scene.add(plane);

//         // 渲染循环
//         function animate() {
//           requestAnimationFrame(animate);
//           renderer.render(scene, camera);
//         }
//         animate();
//       });
//   }
//   return <div className="w-full h-full bg-black" onClick={() => {
//     // console.log('click')
//     // 手机的话，点击则执行
//     if (isFirstRef.current) {
//       init()
//     }
//   }}>
//     <div id="canvas" className="w-full h-full"></div>
//   </div>
// }
const Test = () => {
  return <div className="scroll-container relative w-full h-[100vh] overflow-y-scroll">
    {/* 透明度 50 */}
    {/* <div className="h-[100vh] w-full bg-gray-500 z-20"></div> */}
    <div className="w-full relative">
      <div className="fixed h-[50vh] w-full bg-blue-500 z-10"></div>
      <div className="w-full relative z-10">
        <div className="h-[100vh] w-full bg-yellow-500"></div>
        <div className="h-[100vh] w-full bg-green-500"></div>
      </div>
    </div>


    {/* <div className="h-[100vh] w-full bg-yellow-500 z-20"></div> */}
  </div>
}

export default Test