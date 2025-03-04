import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<'nav'> {
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    { className, separator = <ChevronRight className="h-4 w-4" />, ...props },
    ref
  ) => {
    return (
      <nav
        ref={ref}
        aria-label="breadcrumb"
        className={cn(
          'flex items-center text-sm text-muted-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
Breadcrumb.displayName = 'Breadcrumb';

export interface BreadcrumbListProps
  extends React.ComponentPropsWithoutRef<'ol'> {}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  ({ className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        className={cn(
          'flex flex-wrap items-center gap-1.5 sm:gap-2.5',
          className
        )}
        {...props}
      />
    );
  }
);
BreadcrumbList.displayName = 'BreadcrumbList';

export interface BreadcrumbItemProps
  extends React.ComponentPropsWithoutRef<'li'> {
  current?: boolean;
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, current, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn('inline-flex items-center gap-1.5', className)}
        aria-current={current ? 'page' : undefined}
        {...props}
      />
    );
  }
);
BreadcrumbItem.displayName = 'BreadcrumbItem';

export interface BreadcrumbLinkProps
  extends React.ComponentPropsWithoutRef<typeof Link> {}

const BreadcrumbLink: React.FC<BreadcrumbLinkProps> = ({
  className,
  ...props
}) => {
  return (
    <Link
      className={cn('transition-colors hover:text-foreground', className)}
      {...props}
    />
  );
};

export interface BreadcrumbSeparatorProps
  extends React.ComponentPropsWithoutRef<'li'> {}

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>(({ className, ...props }, ref) => {
  return (
    <li
      ref={ref}
      className={cn('text-muted-foreground ml-3', className)}
      {...props}
    />
  );
});
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator';

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
};
