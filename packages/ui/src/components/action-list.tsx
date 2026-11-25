import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn.js';
import { Badge } from './badge.js';
import { Card } from './card.js';
import { Icon, type IconName } from './icon.js';
import { Heading } from './typography.js';

export type ActionListTone = 'danger' | 'warning' | 'info';

export interface ActionListItem {
  /** Stable key for the row. */
  readonly id: string;
  readonly tone: ActionListTone;
  /** What happened, in one sentence. */
  readonly title: ReactNode;
  /** Why it happened — clamped to two lines; the full text lives behind the action. */
  readonly detail?: ReactNode;
  /** What follows if nobody acts, in the quietest type on the row. */
  readonly note?: ReactNode;
  /** A deadline or state worth seeing at a glance, drawn as a badge in the row's tone. */
  readonly due?: ReactNode;
  readonly actions?: ReactNode;
}

export interface ActionListProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  readonly title: string;
  /**
   * How many cases the list stands for. It can be more than the rows: one row
   * may stand for several claims of the same kind.
   */
  readonly count?: number;
  readonly items: readonly ActionListItem[];
  /** Where the list sits in the page outline; it looks the same at either level. */
  readonly level?: 2 | 3;
}

/*
 * The severity is drawn as a ring, not a tinted disc. The system ships no 950
 * step for red or yellow, so `bg-bg-error-subtle` and `bg-bg-warning-subtle`
 * are a maroon and a brown slab in dark (see the note in `styles/base.css`).
 * A coloured border on the card surface reads in both themes, and it is the
 * same language the Alert uses for the same tones.
 */
const RING: Record<ActionListTone, string> = {
  danger: 'border-border-error text-icon-error',
  warning: 'border-border-warning text-icon-warning',
  info: 'border-border-blue text-icon-blue',
};

const GLYPH: Record<ActionListTone, IconName> = {
  danger: 'alert-circle',
  warning: 'alert',
  info: 'info',
};

/**
 * The severity in words, for a screen reader. The ring is the only other place
 * it is drawn, and colour alone is not a way of saying anything.
 */
const SEVERITY: Record<ActionListTone, string> = {
  danger: 'Urgent',
  warning: 'Needs attention',
  info: 'For your information',
};

/**
 * What is waiting on the person reading the screen — one card, one row per
 * thing to act on, each row carrying its own action.
 *
 * Built for the top of a dashboard, where stacked full-width alerts each
 * claimed the first screen for themselves and pushed the numbers below the
 * fold. A list keeps every case visible at the height of a row, and the
 * severity lives on the row's icon and badge instead of on a coloured frame
 * around the whole thing. Nothing is drawn when nothing is waiting, so a
 * screen can render it unconditionally.
 */
export const ActionList = ({
  title,
  count,
  items,
  level = 2,
  className,
  ...rest
}: ActionListProps) => {
  if (items.length === 0) return null;

  return (
    <section aria-label={title} className={className} {...rest}>
      <Card padded={false} className="overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 md:px-6">
          <Heading level={3} as={`h${level}`}>
            {title}
          </Heading>
          {count !== undefined && <Badge tone="neutral">{count}</Badge>}
        </div>
        <ul className="divide-y divide-border-subtle border-t border-border-subtle">
          {items.map((item) => (
            // A grid rather than nested flex rows, so that on a phone the
            // actions drop into the words' column and line up under the title
            // without an indent computed from the ring's width — the spacing
            // scale has no step equal to ring plus gap, and a guessed one was
            // 8px off. From `sm` the actions take a third column of their own.
            <li
              key={item.id}
              data-tone={item.tone}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-3 px-5 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] md:px-6"
            >
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border',
                  RING[item.tone],
                )}
              >
                <Icon name={GLYPH[item.tone]} size={18} label={SEVERITY[item.tone]} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                {item.detail !== undefined && (
                  <p className="mt-0.5 line-clamp-2 max-w-measure text-sm text-text-secondary">
                    {item.detail}
                  </p>
                )}
                {item.note !== undefined && (
                  <p className="mt-1 max-w-measure text-xs text-text-tertiary">{item.note}</p>
                )}
              </div>
              {(item.due !== undefined || item.actions !== undefined) && (
                <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-3 sm:row-start-1 sm:self-center sm:justify-end sm:pl-3">
                  {item.due !== undefined && <Badge tone={item.tone}>{item.due}</Badge>}
                  {item.actions}
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </section>
  );
};
