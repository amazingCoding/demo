import { useEffect } from "react";
import { imgs } from "./action";
// import { throttle } from "./help";

function New() {
  useEffect(() => {
    init()
  }, [])
  const init = () => {
    const THREE = window.THREE
    const scene = new THREE.Scene();
    const container = document.getElementById('canvas') as HTMLDivElement;
    const scrollContainer = document.getElementById('scroll-container') as HTMLDivElement;
    // 创建相机
    const camera = new THREE.PerspectiveCamera(75, container?.clientWidth / container?.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container?.clientWidth, container?.clientHeight);
    container?.appendChild(renderer.domElement);
    // 创建平面几何体，并添加到场景
    const geometry = new THREE.PlaneGeometry(5, 5); // 16:9 比例的平面
    let texture = new THREE.TextureLoader().load(imgs[0]); // 加载第一帧图片
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true, // 支持透明
      opacity: 1, // 完全不透明
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    camera.position.z = 5;
    // 准备 240 张图片路径
    const totalFrames = imgs.length;
    // 将所有帧图片路径存储在一个数组中
    const images: string[] = imgs;
    // 预加载所有图片
    const loadedTextures: any[] = [];
    const loader = new THREE.TextureLoader();
    images.forEach((imagePath, index) => {
      loader.load(imagePath, (texture: any) => {
        loadedTextures[index] = texture;
      });
    });

    // 更新帧函数，根据当前帧数切换纹理
    function updateTexture(frame: number) {
      if (loadedTextures[frame]) {
        material.map.dispose(); // 释放旧纹理
        material.map = loadedTextures[frame]; // 更新为新的纹理
        material.needsUpdate = true; // 告诉 Three.js 更新材质
      }
    }


    // // 使用 setInterval 来控制帧率
    // setInterval(updateTexture, frameRate);

    // 渲染循环
    function animate() {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    // 根据滚动条位置计算当前帧数
    function onScroll() {
      const maxScroll = scrollContainer?.scrollHeight - scrollContainer?.clientHeight;
      const scrollTop = scrollContainer?.scrollTop;

      // 计算当前帧数 (0 ~ 240)
      const scrollProgress = scrollTop / maxScroll;
      const currentFrame = Math.min(totalFrames - 1, Math.floor(scrollProgress * totalFrames));

      updateTexture(currentFrame); // 更新动画帧
    }

    // 监听 scroll-container 滚动事件. 使用节流 
    scrollContainer?.addEventListener('scroll', onScroll);
    animate();
  }
  return (
    <div className="w-full h-full bg-black flex justify-center items-center px-[20px]">
      <div id="canvas" className="md:w-[800px] md:h-[800px] w-[280px] h-[280px] bg-white"></div>
      <div className="w-[100px] h-full bg-red-500 relative ml-[20px] overflow-y-auto" id="scroll-container">
        <div style={{
          height: '400%',
        }}>
          <div style={{
            height: '25%',
          }} className="w-[100px] bg-gray-500 mx-auto"></div>
          <div style={{
            height: '25%',
          }} className="w-[100px] bg-blue-500 mx-auto"></div>
          <div style={{
            height: '25%',
          }} className="w-[100px] bg-green-500 mx-auto"></div>
          <div style={{
            height: '25%',
          }} className="w-[100px] bg-yellow-500 mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
export default New;