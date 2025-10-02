import { Form as FormType } from "@/shared/types/blocks/form";
import { Form } from "@/shared/blocks/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";

export function FormCard({
  form,
  className,
}: {
  form: FormType;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      {form.title && (
        <CardHeader>
          <CardTitle>{form.title}</CardTitle>
        </CardHeader>
      )}
      {form.description && (
        <CardDescription className="px-6">{form.description}</CardDescription>
      )}
      {form && (
        <CardContent>
          <Form {...form} />
        </CardContent>
      )}
    </Card>
  );
}
