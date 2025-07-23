import { FC, ReactElement, useEffect, useState } from 'react';
import { ISliderImagesText } from 'src/shared/shared.interface';
import { sliderImages, sliderImagesText } from 'src/shared/utils/static-data';

import { ISliderState } from '../interfaces/home.interface';

const HomeSlider: FC = (): ReactElement => {
  const [slideState, setSlideState] = useState<ISliderState>({
    slideShow: sliderImages[0],
    slideIndex: 0
  });
  const [sliderInterval, setSliderInterval] = useState<NodeJS.Timeout>();
  const [currentSliderImageText, setCurrentSliderImageText] = useState<ISliderImagesText>(sliderImagesText[0]);

  const { slideIndex, slideShow } = slideState;
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
    <div className="relative">
      <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-surface shadow-lg lg:h-96 xl:h-[28rem]">
        <img alt="slider" className="h-full w-full object-cover transition-all duration-700 ease-in-out" src={slideShow} />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col justify-center px-6 lg:px-12">
          <div className="max-w-2xl">
            <h1 className="font-themeFont text-3xl font-bold leading-tight text-on-primary md:text-4xl lg:text-5xl xl:text-6xl">
              {currentSliderImageText.header}
            </h1>
            <p className="mt-4 text-lg font-medium text-on-primary/90 md:text-xl lg:text-2xl">{currentSliderImageText.subHeader}</p>
          </div>
        </div>

        {/* Modern slide indicators */}
        <div className="absolute bottom-6 left-6 flex gap-2 lg:bottom-8 lg:left-12">
          {sliderImages.map((_, index: number) => (
            <button
              key={index}
              title={`Go to slide ${index + 1}`}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                slideIndex === index ? 'bg-on-primary shadow-md' : 'bg-on-primary/40 hover:bg-on-primary/60'
              } lg:h-3 lg:w-10`}
              onClick={() => {
                setSlideState({
                  slideShow: sliderImages[index],
                  slideIndex: index
                });
                setCurrentSliderImageText(sliderImagesText[index]);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeSlider;
