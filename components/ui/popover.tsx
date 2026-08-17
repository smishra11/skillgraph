'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react/popover';

import { cn } from '@/lib/utils';

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot='popover' {...props} />;
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot='popover-trigger' {...props} />;
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> & {
  align?: React.ComponentProps<typeof PopoverPrimitive.Positioner>['align'];
  sideOffset?: React.ComponentProps<
    typeof PopoverPrimitive.Positioner
  >['sideOffset'];
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        sideOffset={sideOffset}
        className='z-50'
      >
        <PopoverPrimitive.Popup
          data-slot='popover-content'
          className={cn(
            'bg-popover text-popover-foreground',
            'w-72 rounded-lg border p-4 shadow-md outline-none',
            'origin-(--transform-origin)',
            'transition-[transform,scale,opacity]',
            'data-starting-style:scale-95 data-starting-style:opacity-0',
            'data-ending-style:scale-95 data-ending-style:opacity-0',
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
