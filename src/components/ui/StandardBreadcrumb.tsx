import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrent?: boolean;
}

interface StandardBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * StandardBreadcrumb - A standardized breadcrumb component with consistent styling
 *
 * @param {BreadcrumbItem[]} items - Array of breadcrumb items with label, href, and optional isCurrent flag
 * @param {string} className - Optional additional classes
 * @returns {JSX.Element} Standardized breadcrumb navigation
 */
export const StandardBreadcrumb: React.FC<StandardBreadcrumbProps> = ({
  items,
  className,
}) => {
  return (
    <Breadcrumb className={className}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            <BreadcrumbLink
              to={item.href}
              className={item.isCurrent ? 'font-medium text-foreground' : ''}
            >
              {item.label}
            </BreadcrumbLink>
          </BreadcrumbItem>
          {index < items.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
};

export default StandardBreadcrumb;
