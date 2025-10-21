import { Fragment } from 'react';

import { Link } from '@/core/i18n/navigation';
import { Form } from '@/shared/blocks/form';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { Crumb } from '@/shared/types/blocks/common';
import { Form as FormType } from '@/shared/types/blocks/form';

export function FormCard({
  title,
  description,
  crumbs,
  form,
  className,
}: {
  title?: string;
  description?: string;
  crumbs?: Crumb[];
  form: FormType;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      {crumbs && crumbs.length > 0 && (
        <Breadcrumb className="px-6">
          <BreadcrumbList>
            {crumbs.map((crumb, index) => (
              <Fragment key={index}>
                <BreadcrumbItem className="hidden md:block">
                  {crumb.is_active ? (
                    <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                  ) : (
                    <Link href={crumb.url || ''}>{crumb.title}</Link>
                  )}
                </BreadcrumbItem>
                {index < crumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && (
            <CardDescription
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </CardHeader>
      )}

      {form && (
        <CardContent>
          <Form {...form} />
        </CardContent>
      )}
    </Card>
  );
}
