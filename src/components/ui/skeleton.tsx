import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "avatar";
  width?: string;
  height?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "default",
  width,
  height,
}) => {
  const baseClasses = "skeleton-loading rounded bg-muted animate-pulse";

  const variantClasses = {
    default: "h-4",
    card: "h-64 w-full",
    text: "h-4 w-3/4",
    avatar: "h-12 w-12 rounded-full",
  };

  const style = {
    ...(width && { width }),
    ...(height && { height }),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

// Specific skeleton for home page components - optimized for LCP
export const HomeComponentSkeleton: React.FC = () => (
  <div
    className="layout-stable min-h-[300px] rounded-lg border p-6 space-y-4"
    style={{ containIntrinsicSize: "1px 300px" }}
  >
    <Skeleton variant="text" width="40%" />
    <div className="space-y-2">
      <Skeleton variant="default" />
      <Skeleton variant="default" width="85%" />
      <Skeleton variant="default" width="70%" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton variant="card" height="120px" />
      <Skeleton variant="card" height="120px" />
    </div>
  </div>
);

// Card skeleton with proper aspect ratio
export const CardSkeleton: React.FC = () => (
  <div className="layout-stable space-y-3 rounded-lg border p-4">
    <Skeleton variant="card" height="200px" />
    <Skeleton variant="text" width="60%" />
    <Skeleton variant="default" width="80%" />
    <Skeleton variant="default" width="40%" />
  </div>
);

// Artist card skeleton
export const ArtistSkeleton: React.FC = () => (
  <div className="layout-stable flex items-center space-x-4 rounded-lg border p-4">
    <Skeleton variant="avatar" />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="default" width="50%" />
    </div>
  </div>
);

export default Skeleton;
