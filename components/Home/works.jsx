import { data } from '../../Data/HowItWorks';
import React from 'react'

function HowITWorks() {
    return (
      <section className='w-full py-12 md:py-24 lg:py-32 bg-background'>
         <div className='container mx-auto px-4 md:px-6'>
            <div className='text-center max-w-3xl mx-auto mb-12'>
                <h2 className='text-4xl font-semibold mb-4'>How it works</h2>
                 <p className='text-muted-foreground'>
                    Four simple steps to accelerate your career growth
                 </p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
               {data.map((item, index) => (
                  <div key={index} className="flex flex-col items-center text-center">
                      <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4'>
                          <item.Icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>
    )
}


export default HowITWorks;
