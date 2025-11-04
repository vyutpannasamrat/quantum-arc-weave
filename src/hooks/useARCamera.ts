import { useState, useEffect, useRef } from 'react';

interface DeviceOrientation {
  alpha: number | null; // Compass heading (0-360)
  beta: number | null;  // Front-to-back tilt (-180 to 180)
  gamma: number | null; // Left-to-right tilt (-90 to 90)
}

export const useARCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermissions = async () => {
    try {
      // Request camera permission
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      
      setStream(mediaStream);
      setPermissionGranted(true);

      // For iOS 13+, request device orientation permission
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission !== 'granted') {
          setError('Device orientation permission denied');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setPermissionGranted(false);
    }
  };

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setOrientation({
        alpha: event.alpha, // Compass
        beta: event.beta,   // Pitch
        gamma: event.gamma, // Roll
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    orientation,
    error,
    permissionGranted,
    requestPermissions,
  };
};
