// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Calculate bearing between two points
export const calculateBearing = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);

  return ((θ * 180) / Math.PI + 360) % 360; // Bearing in degrees (0-360)
};

// Calculate AR marker position on screen
export const calculateMarkerPosition = (
  userLat: number,
  userLon: number,
  userHeading: number,
  actionLat: number,
  actionLon: number,
  screenWidth: number
): { left: number; visible: boolean } => {
  const bearing = calculateBearing(userLat, userLon, actionLat, actionLon);
  const relativeBearing = bearing - userHeading;
  
  // Normalize to -180 to 180
  let normalizedBearing = relativeBearing;
  if (normalizedBearing > 180) normalizedBearing -= 360;
  if (normalizedBearing < -180) normalizedBearing += 360;

  // Only show markers within ~90 degree field of view
  const visible = Math.abs(normalizedBearing) < 45;

  // Map bearing to screen position (assuming 90 degree FOV)
  const horizontalPosition = (normalizedBearing / 45) * (screenWidth / 2) + screenWidth / 2;

  return {
    left: horizontalPosition,
    visible,
  };
};

// Format distance for display
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};
