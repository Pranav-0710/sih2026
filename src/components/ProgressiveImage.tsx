import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Extra classes for the wrapper, which carries the shimmer placeholder. */
  wrapperClassName?: string;
}

/**
 * Image that holds a shimmering placeholder until the file decodes, so
 * photo-heavy sections fade in instead of popping.
 */
const ProgressiveImage = ({
  className,
  wrapperClassName,
  onLoad,
  ...props
}: ProgressiveImageProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("relative overflow-hidden", wrapperClassName)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted" aria-hidden />
      )}
      <img
        {...props}
        loading={props.loading ?? "lazy"}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        className={cn(
          "transition-opacity duration-700",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </div>
  );
};

export default ProgressiveImage;
