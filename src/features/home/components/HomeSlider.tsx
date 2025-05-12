import { FC, ReactElement, useEffect, useState } from 'react';
import { ISliderImagesText } from 'src/shared/shared.interface';
import { sliderImages, sliderImagesText } from 'src/shared/utils/static-data';

import { ISliderState } from 'src/features/home/interfaces/home.interface';

const HomeSlider: FC = (): ReactElement => {
  const [slideState, setSlideState] = useState<ISliderState>({
    slideShow: sliderImages[0],
    slideIndex: 0
  });
  const [sliderInterval, setSliderInterval] = useState<NodeJS.Timeout>();
  const [currentSliderImageText, setCurrentSliderImageText] = useState<ISliderImagesText>(sliderImagesText[0]);

  const { slideIndex } = slideState;
  let currentSlideIndex = 0;

  useEffect(() => {
    const timeInterval: NodeJS.Timeout = setInterval(() => {
      autoMoveSlide();
    }, 4000);
    setSliderInterval(timeInterval);

    return () => {
      clearInterval(timeInterval);
      clearInterval(sliderInterval);
    };
  }, []);

  const autoMoveSlide = (): void => {
    const lastIndex = currentSlideIndex + 1;
    currentSlideIndex = lastIndex >= sliderImages.length ? 0 : lastIndex;
    setCurrentSliderImageText(sliderImagesText[currentSlideIndex]);
    setSlideState((prev: ISliderState) => ({
      ...prev,
      slideIndex: currentSlideIndex,
      slideShow: sliderImages[currentSlideIndex]
    }));
  };

  return (
    <section className="px-4 sm:px-6 md:px-10 lg:px-20 mt-10">
      <div className="relative w-full mx-auto overflow-hidden rounded-2xl border border-[#E5E7EB] shadow-xl h-[26rem] sm:h-[30rem] md:h-[34rem] lg:h-[38rem] group">
        {/* IMAGE LAYERS */}
        {sliderImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
              slideIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            loading="lazy"
            style={{ imageRendering: 'auto' }}
          />
        ))}

        {/* TEXT OVERLAY */}
        <div
          key={slideIndex}
          className="absolute bottom-6 sm:bottom-8 left-4 sm:left-6 md:left-10 z-30 w-full sm:max-w-[85%] md:max-w-[90%] lg:max-w-[80%] xl:max-w-[70%] backdrop-blur-lg bg-white/10 border border-white/20 p-5 sm:p-6 md:p-8 rounded-xl shadow-lg transition-all animate-fade-in"
        >
          <div className="mb-3 w-10 h-1.5 bg-[#14B8A6] rounded-full"></div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-themeFont text-white tracking-tight leading-snug drop-shadow-md">
            {sliderImagesText[slideIndex]?.header}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/90 leading-snug">{sliderImagesText[slideIndex]?.subHeader}</p>
        </div>
      </div>
    </section>
  );
};

export default HomeSlider;
