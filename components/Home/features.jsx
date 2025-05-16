import { GlowingEffect } from "@/components/ui/glowing-effect";
import { BentoGridThirdDemo } from "./bento-cards";


const Features = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen py-16 px-4">
      <h1 className="text-4xl font-bold text-center mb-10">
        <p className=" text-shadow-neutral-200">Powerful Features</p>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          for Your Career Growth
        </span>
      </h1>
      
      <div className="relative w-full max-w-4xl rounded-xl bg-zinc-900/70 flex flex-col items-center justify-center overflow-hidden p-8">
        <GlowingEffect 
          disabled={false} 
          glow={true}
          spread={30}
          blur={8}
        />
        <BentoGridThirdDemo />
      </div>
    </div>
  );
}

export default Features;