import clsx from "clsx";

interface ShimmerProps {
  className?: string;
}

const Shimmer = ({ className }: ShimmerProps) => {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded",
        className
      )}
    />
  );
};

export default Shimmer;
