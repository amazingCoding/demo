import { useEffect, useState } from "react";

export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  } as T;
}

export const useWindowChange = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  useEffect(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    })
    window.addEventListener('resize', () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    })
    return () => {
      window.removeEventListener('resize', () => { })
    }
  }, [])
  return size
}