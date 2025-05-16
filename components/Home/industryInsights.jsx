"use client";
import { cn } from "@/lib/utils";
import { GridPattern } from "../magicui/grid-pattern";


function IndustryInsights() {
    return (
       <section className="relative w-full py-12 md:py-24 lg:py-32 bg-muted/10 overflow-hidden">
        <GridPattern squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [9, 16],
          [16,9],
        ]}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}/>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="flex flex-col  items-center justify-center space-y-2">
            <h3 className="text-4xl font-semibold ">
              50+
              <p className="text-muted-foreground">Industries Covered</p>
            </h3>
            </div>
              <div className=" flex flex-col  items-center justify-center space-y-2">
            <h3 className="text-4xl font-semibold ">
              1000+
              <p className="text-muted-foreground">Interview Questions</p>
            </h3>
            </div>
            <div className=" flex flex-col  items-center justify-center space-y-2">
            <h3 className="text-4xl font-semibold ">
              95%
              <p className="text-muted-foreground">Success <br /> Rate</p>
            </h3>
            </div>
              <div className=" flex flex-col items-center justify-center space-y-2">
            <h3 className="text-4xl font-semibold ">
              24/7
              <p className="text-muted-foreground ">AI Support</p>
            </h3>
            </div>

          </div>
      

        </div>
       </section>
    )
}

export default IndustryInsights;
