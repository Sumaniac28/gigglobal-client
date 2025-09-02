import { FC, ReactElement, useContext } from 'react';
import { GigContext } from 'src/features/gigs/context/GigContext';
import { v4 as uuidv4 } from 'uuid';

const GigLeftAbout: FC = (): ReactElement => {
  const { gig } = useContext(GigContext);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-themeFont font-bold text-primary mb-4">About This Gig</h3>
        <div
          className="text-primary leading-7 text-sm sm:text-base prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: gig.description }}
        />
      </div>

      <div className="border-t border-default pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <span className="text-sm font-themeFont font-semibold text-muted uppercase tracking-wide">Main Category</span>
            <div className="px-3 py-2 bg-accent/10 border border-accent/30 rounded-lg">
              <span className="text-primary font-medium">{gig.categories}</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-themeFont font-semibold text-muted uppercase tracking-wide">Sub Categories</span>
            <div className="flex flex-wrap gap-2">
              {gig?.subCategories.map((category: string) => (
                <span
                  key={uuidv4()}
                  className="px-3 py-1 bg-surface border border-default rounded-full text-sm font-medium text-primary hover:bg-accent/10 transition-colors duration-300"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {gig.tags && gig.tags.length > 0 && (
        <div className="border-t border-default pt-6">
          <span className="text-sm font-themeFont font-semibold text-muted uppercase tracking-wide mb-3 block">Tags</span>
          <div className="flex flex-wrap gap-2">
            {gig.tags.map((tag: string) => (
              <span
                key={uuidv4()}
                className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-xs font-medium text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GigLeftAbout;
