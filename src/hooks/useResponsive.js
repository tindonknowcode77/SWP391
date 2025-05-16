import { useState, useEffect } from 'react';

/**
 * Breakpoints for responsive design
 * @type {Object}
 */
const breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

/**
 * Custom hook for handling responsive design logic
 * 
 * @returns {Object} Object containing various responsive utilities
 */
const useResponsive = () => {
  // Initialize state with default values
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });
  
  // Function to update window size in state
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };
  
  // Setup resize event listener
  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') return;
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  /**
   * Check if the current screen width is greater than or equal to a breakpoint
   * @param {string} breakpoint - Breakpoint name (xs, sm, md, lg, xl, xxl)
   * @returns {boolean} True if width is greater than or equal to the breakpoint
   */
  const isAbove = (breakpoint) => {
    if (!breakpoints[breakpoint]) {
      console.warn(`Unknown breakpoint: ${breakpoint}`);
      return false;
    }
    
    return windowSize.width >= breakpoints[breakpoint];
  };
  
  /**
   * Check if the current screen width is less than a breakpoint
   * @param {string} breakpoint - Breakpoint name (xs, sm, md, lg, xl, xxl)
   * @returns {boolean} True if width is less than the breakpoint
   */
  const isBelow = (breakpoint) => {
    if (!breakpoints[breakpoint]) {
      console.warn(`Unknown breakpoint: ${breakpoint}`);
      return false;
    }
    
    return windowSize.width < breakpoints[breakpoint];
  };
  
  /**
   * Check if the current screen width is between two breakpoints
   * @param {string} minBreakpoint - Minimum breakpoint name (inclusive)
   * @param {string} maxBreakpoint - Maximum breakpoint name (exclusive)
   * @returns {boolean} True if width is between the breakpoints
   */
  const isBetween = (minBreakpoint, maxBreakpoint) => {
    if (!breakpoints[minBreakpoint] || !breakpoints[maxBreakpoint]) {
      console.warn(`Unknown breakpoint: ${minBreakpoint} or ${maxBreakpoint}`);
      return false;
    }
    
    return (
      windowSize.width >= breakpoints[minBreakpoint] && 
      windowSize.width < breakpoints[maxBreakpoint]
    );
  };
  
  /**
   * Get the current breakpoint name
   * @returns {string} Current breakpoint name
   */
  const getCurrentBreakpoint = () => {
    if (windowSize.width >= breakpoints.xxl) return 'xxl';
    if (windowSize.width >= breakpoints.xl) return 'xl';
    if (windowSize.width >= breakpoints.lg) return 'lg';
    if (windowSize.width >= breakpoints.md) return 'md';
    if (windowSize.width >= breakpoints.sm) return 'sm';
    return 'xs';
  };
  
  /**
   * Check if the screen is in portrait orientation
   * @returns {boolean} True if in portrait orientation
   */
  const isPortrait = () => {
    return windowSize.height > windowSize.width;
  };
  
  /**
   * Check if the screen is in landscape orientation
   * @returns {boolean} True if in landscape orientation
   */
  const isLandscape = () => {
    return windowSize.width > windowSize.height;
  };
  
  /**
   * Check if the device is likely a mobile device
   * @returns {boolean} True if likely a mobile device
   */
  const isMobile = () => {
    return windowSize.width < breakpoints.md;
  };
  
  /**
   * Check if the device is likely a tablet
   * @returns {boolean} True if likely a tablet
   */
  const isTablet = () => {
    return windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg;
  };
  
  /**
   * Check if the device is likely a desktop
   * @returns {boolean} True if likely a desktop
   */
  const isDesktop = () => {
    return windowSize.width >= breakpoints.lg;
  };
  
  /**
   * Get a style value based on the current breakpoint
   * @param {Object} values - Object with breakpoint names as keys and values
   * @param {any} defaultValue - Default value if no matching breakpoint is found
   * @returns {any} Style value for the current breakpoint
   */
  const getResponsiveValue = (values, defaultValue = null) => {
    const currentBreakpoint = getCurrentBreakpoint();
    
    // Try to find the exact matching breakpoint
    if (values[currentBreakpoint] !== undefined) {
      return values[currentBreakpoint];
    }
    
    // Try to find the closest lower breakpoint
    const breakpointOrder = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const currentIndex = breakpointOrder.indexOf(currentBreakpoint);
    
    for (let i = currentIndex + 1; i < breakpointOrder.length; i++) {
      if (values[breakpointOrder[i]] !== undefined) {
        return values[breakpointOrder[i]];
      }
    }
    
    // Try to find the closest higher breakpoint
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (values[breakpointOrder[i]] !== undefined) {
        return values[breakpointOrder[i]];
      }
    }
    
    // Return default if no matching breakpoint found
    return defaultValue;
  };
  
  /**
   * Get CSS classes for different breakpoints
   * @param {Object} classes - Object with breakpoint names as keys and class names as values
   * @returns {string} Space-separated list of class names
   */
  const getResponsiveClasses = (classes) => {
    return Object.entries(classes)
      .filter(([breakpoint, value]) => {
        if (breakpoint === 'xs') return true;
        if (breakpoint === 'sm') return windowSize.width >= breakpoints.sm;
        if (breakpoint === 'md') return windowSize.width >= breakpoints.md;
        if (breakpoint === 'lg') return windowSize.width >= breakpoints.lg;
        if (breakpoint === 'xl') return windowSize.width >= breakpoints.xl;
        if (breakpoint === 'xxl') return windowSize.width >= breakpoints.xxl;
        return false;
      })
      .map(([_, value]) => value)
      .join(' ');
  };
  
  // Return all the responsive utilities
  return {
    windowSize,
    breakpoints,
    isAbove,
    isBelow,
    isBetween,
    getCurrentBreakpoint,
    isPortrait,
    isLandscape,
    isMobile,
    isTablet,
    isDesktop,
    getResponsiveValue,
    getResponsiveClasses
  };
};

export default useResponsive;