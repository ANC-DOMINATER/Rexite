import React from 'react'
import { faqs } from '../../Data/faq';
import { GridPattern } from '../magicui/grid-pattern';
import { cn } from '@/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function FaQ() {
    return (
       <section className='relative w-full py-12 md:py-24 lg:py-32 bg-background overflow-hidden'>
             <div className="absolute inset-0 pointer-events-none">
                <GridPattern
                    width={30}
                    height={30}
                    x={-1}
                    y={-1}
                    strokeDasharray={"4 2"}
                    className={cn(
                        "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
                        "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
                    )}
                />
             </div>

                <div className='container mx-auto px-4 md:px-6 relative'>
                   <div className='text-center max-w-3xl mx-auto mb-12'>
                       <h2 className='text-4xl font-semibold mb-4'>Frequently Asked Questions</h2>
                        <p className='text-muted-foreground'>
                           Find the common questions and answers about our platform
                        </p>
                   </div>
                     <div className='max-w-6xl mx-auto'>
                          <Accordion type="single" collapsible className="w-full">
                              {faqs.map((faq, index) => {
                                return(
                                     <AccordionItem key={index} value={`item-${index}`}>
                                        <AccordionTrigger>
                                               {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {faq.answer}
                                        </AccordionContent>
                                     </AccordionItem>
                                      
                                )
                              })}
                          </Accordion>
                         </div>
                </div>
             </section>
    );
}

export default FaQ;
