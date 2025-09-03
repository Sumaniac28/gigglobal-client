import { FC, ReactElement } from 'react';
import { v4 as uuidv4 } from 'uuid';

const ChatBoxSkeleton: FC = (): ReactElement => {
  return (
    <div className="fixed bottom-0 left-2 right-2 h-[400px] max-h-[500px] w-auto border border-border-default bg-surface shadow-2xl rounded-t-lg md:left-8 md:h-96 md:max-h-[500px] md:w-96">
      <div className="flex items-center space-x-4 border-b border-border-default px-5 py-4 animate-pulse bg-surface rounded-t-lg">
        <div className="rounded-full bg-muted/20 h-12 w-12"></div>
        <div className="w-full">
          <div className="space-y-3">
            <div className="col-span-3 h-3 rounded bg-muted/20"></div>
            <div className="h-2 w-2/4 rounded bg-muted/20"></div>
          </div>
        </div>
      </div>

      <div className="h-[500px] overflow-y-scroll bg-background md:h-full">
        <div className="my-2 flex h-[280px] flex-col overflow-hidden px-4 md:h-[72%] animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((msg: number) => (
            <div key={uuidv4()} className={`my-3 flex max-w-[300px] gap-y-6 text-sm ${msg % 2 === 0 ? 'flex-row-reverse self-end' : ''}`}>
              <div className={`rounded-full bg-muted/20 h-10 w-10 ${msg % 2 === 0 ? 'hidden' : ''}`}></div>
              <p
                className={`ml-2 w-[200px] rounded-2xl bg-muted/20 px-4 py-4 text-start text-sm font-normal
                    md:w-[220px] ${msg % 2 === 0 ? 'w-[200px] rounded-2xl bg-primary/20 py-5' : ''}`}
              ></p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 mb-2 flex px-2 animate-pulse bg-surface border-t border-border-default rounded-b-lg">
        <div className="mb-0 w-full rounded-lg p-4 bg-muted/20"></div>
      </div>
    </div>
  );
};

export default ChatBoxSkeleton;
