import { LoaderIcon } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="absolute top-0 left-0 h-screen w-screen flex items-center justify-center bg-background z-[999]">
      <LoaderIcon className="h-10 w-10 animate-spin" />
    </div>
  );
};

export default Loading;
