import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { InfiniteSlider } from './InfiniteSlider';
import { ProgressiveBlur } from './ProgressiveBlur';
import { cn } from '../../lib/utils';

export function HeroSection() {
    return (
        <main className="overflow-x-hidden bg-white">
            <section className="relative">
                <div className="pb-24 pt-12 md:pb-32 lg:pb-32 lg:pt-32">
                    <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                        <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left relative z-10">
                            <h1 className="mt-8 max-w-2xl text-balance text-5xl font-bold md:text-6xl lg:mt-16 xl:text-7xl text-gray-900 leading-[1.1]">
                                Bridge Academia & <span className="text-mustard-500">Industry</span>
                            </h1>
                            <p className="mt-8 max-w-2xl text-pretty text-lg text-gray-600 leading-relaxed">
                                Connect talented students with innovative startups. Build real-world projects, gain experience, and create meaningful impact through InAcadFusion.
                            </p>

                            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                                <Button
                                    asChild
                                    size="lg"
                                    className="px-8 py-6 text-lg font-semibold bg-mustard-500 hover:bg-mustard-600 text-black rounded-xl shadow-lg shadow-mustard-500/20 transition-all hover:scale-105 active:scale-95">
                                    <Link to="/register">
                                        <span className="text-nowrap">Get Started</span>
                                    </Link>
                                </Button>
                                <Button
                                    key={2}
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="px-8 py-6 text-lg font-semibold border-gray-200 hover:bg-gray-50 rounded-xl transition-all hover:scale-105 active:scale-95">
                                    <Link to="/projects">
                                        <span className="text-nowrap">Explore Projects</span>
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Indicator Mini */}
                            <div className="mt-12 flex items-center gap-4 justify-center lg:justify-start opacity-70">
                                <div className="flex -space-x-2">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-sm text-gray-500 font-medium">Joined by 500+ Students this month</p>
                            </div>
                        </div>

                        {/* Hero Image Container */}
                        <div className="relative lg:absolute lg:inset-0 lg:-right-20 lg:-top-20 lg:h-full lg:w-2/3 ml-auto mt-12 lg:mt-0">
                             <img
                                className="pointer-events-none w-full h-auto object-contain lg:h-full lg:object-right opacity-90 mix-blend-multiply"
                                src="https://ik.imagekit.io/lrigu76hy/tailark/abstract-bg.jpg?updatedAt=1745733473768"
                                alt="Abstract Digital Connection"
                            />
                            {/* Gradient overlays to blend image */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/50 to-transparent hidden lg:block" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-transparent hidden lg:block" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Logo Cloud Section */}
            <section className="bg-white pb-16 md:pb-24 border-t border-gray-50 pt-12">
                <div className="group relative m-auto max-w-6xl px-6">
                    <div className="flex flex-col items-center md:flex-row gap-8">
                        <div className="md:max-w-44 md:border-r md:border-gray-100 md:pr-8 text-center md:text-left">
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Trusted Partners</p>
                        </div>
                        <div className="relative py-4 md:w-[calc(100%-12rem)] overflow-hidden">
                            <InfiniteSlider
                                speedOnHover={20}
                                speed={40}
                                gap={80}>
                                {[
                                    { name: 'Nvidia', src: 'https://html.tailus.io/blocks/customers/nvidia.svg', h: 'h-6' },
                                    { name: 'Column', src: 'https://html.tailus.io/blocks/customers/column.svg', h: 'h-5' },
                                    { name: 'GitHub', src: 'https://html.tailus.io/blocks/customers/github.svg', h: 'h-5' },
                                    { name: 'Nike', src: 'https://html.tailus.io/blocks/customers/nike.svg', h: 'h-6' },
                                    { name: 'Lemon Squeezy', src: 'https://html.tailus.io/blocks/customers/lemonsqueezy.svg', h: 'h-6' },
                                    { name: 'Laravel', src: 'https://html.tailus.io/blocks/customers/laravel.svg', h: 'h-5' },
                                    { name: 'OpenAI', src: 'https://html.tailus.io/blocks/customers/openai.svg', h: 'h-7' }
                                ].map((logo) => (
                                    <div key={logo.name} className="flex items-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                        <img
                                            className={cn("w-auto filter contrast-[0.8]", logo.h)}
                                            src={logo.src}
                                            alt={`${logo.name} Logo`}
                                        />
                                    </div>
                                ))}
                            </InfiniteSlider>

                            {/* Fade edges for slider */}
                            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
                            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />
                            
                            <ProgressiveBlur
                                className="pointer-events-none absolute left-0 top-0 h-full w-20 z-10"
                                direction="left"
                                blurIntensity={0.5}
                            />
                            <ProgressiveBlur
                                className="pointer-events-none absolute right-0 top-0 h-full w-20 z-10"
                                direction="right"
                                blurIntensity={0.5}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
