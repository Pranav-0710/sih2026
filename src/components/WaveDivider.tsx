import React from 'react';
import { cn } from '@/lib/utils';

const WaveDivider = ({ className, ...props }) => (
  <div className={cn("w-full overflow-hidden leading-none", className)} {...props}>
    <svg
      className="relative block w-full h-[80px] md:h-[150px]"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
    >
      <path
        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
        className="fill-current text-white/10"
      ></path>
      <path
        d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.3-35.85,69.26-2.54,135.94,19.92,205.94,34.62,70,14.7,146.53,26.09,214.34,3V0H0Z"
        opacity=".3"
        className="fill-current text-white/20"
      ></path>
      <path
        d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c161.74-28.75,314.09-42.57,475.83-42.57,73.27,0,148.66,4.53,220.53,13.62V0H0Z"
        opacity=".5"
        className="fill-current text-white/30"
      ></path>
    </svg>
  </div>
);

export default WaveDivider;
