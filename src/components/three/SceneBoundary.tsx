import React from "react";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Isolates WebGL/3D failures (no GPU, blocked context, driver crash) so the
 * rest of the page keeps working and a soft gradient stands in for the scene.
 */
class SceneBoundary extends React.Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    /* intentionally silent — the visual fallback is enough */
  }

  render() {
    if (this.state.failed) {
      return (
        this.props.fallback ?? (
          <div className="grid h-full w-full place-items-center">
            <div className="float-3d h-48 w-48 rounded-full bg-gradient-primary opacity-40 blur-2xl" />
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
};

export default SceneBoundary;
