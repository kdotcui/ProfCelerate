import React, { ReactNode } from 'react';
import StandardBreadcrumb, { BreadcrumbItem } from './StandardBreadcrumb';

interface PageHeaderProps {
  breadcrumbItems: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

/**
 * PageHeader - A standardized header component with breadcrumbs and action buttons
 *
 * @param {BreadcrumbItem[]} breadcrumbItems - Array of breadcrumb items
 * @param {ReactNode} actions - Optional action buttons or other elements to display on the right
 * @param {string} className - Optional additional classes
 * @returns {JSX.Element} Standardized page header with breadcrumbs and actions
 */
const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbItems,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex justify-between items-center mb-6 ${className}`}>
      <StandardBreadcrumb items={breadcrumbItems} />
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default PageHeader;
