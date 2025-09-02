import { FC, ReactElement, useContext } from 'react';
import { createSearchParams, Link } from 'react-router-dom';
import { GigContext } from 'src/features/gigs/context/GigContext';
import { replaceSpacesWithDash } from 'src/shared/utils/utils.service';
import { v4 as uuidv4 } from 'uuid';

const GigRelatedTags: FC = (): ReactElement => {
  const { gig } = useContext(GigContext);

  if (!gig?.tags || gig.tags.length === 0) {
    return <></>;
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-themeFont font-bold text-primary">Related Tags</h4>

      <div className="flex flex-wrap gap-2">
        {gig.tags.map((tag: string) => (
          <Link
            key={uuidv4()}
            to={`/search/gigs?${createSearchParams({ query: `${replaceSpacesWithDash(`${tag}`.trim())}` })}`}
            className="group"
          >
            <span className="inline-block px-3 py-2 bg-surface border border-default rounded-lg text-sm font-medium text-primary hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 cursor-pointer group-hover:shadow-sm">
              #{tag}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GigRelatedTags;
