"use client";

import {
  Form as FormComponent,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  FormField as FormFieldType,
  FormSubmit,
} from "@/shared/types/blocks/form";

import { Button } from "@/shared/components/ui/button";
import { SmartIcon } from "@/shared/blocks/common/smart-icon";
import { Input } from "./input";
import { Loader } from "lucide-react";
import { Select } from "./select";
import { Markdown } from "./markdown";

import { Textarea } from "@/shared/components/ui/textarea";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "@/core/i18n/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { isArray } from "util";
import { Label } from "@/shared/components/ui/label";

function buildFieldSchema(field: FormFieldType) {
  let schema = z.string();

  if (field.validation?.required) {
    schema = schema.min(1, {
      message: field.validation.message || `${field.title} is required`,
    });
  }

  if (field.validation?.min) {
    schema = schema.min(field.validation.min, {
      message:
        field.validation.message ||
        `${field.title} must be at least ${field.validation.min} characters`,
    });
  }

  if (field.validation?.max) {
    schema = schema.max(field.validation.max, {
      message:
        field.validation.message ||
        `${field.title} must be at most ${field.validation.max} characters`,
    });
  }

  if (field.validation?.email) {
    schema = schema.email({
      message:
        field.validation.message || `${field.title} must be a valid email`,
    });
  }

  return schema;
}

const generateFormSchema = (fields: FormFieldType[]) => {
  const schemaFields: Record<string, any> = {};

  fields.forEach((field) => {
    if (field.name) {
      schemaFields[field.name] = buildFieldSchema(field);
    }
  });

  return z.object(schemaFields);
};

export function Form({
  title,
  description,
  fields,
  data,
  passby,
  submit,
}: {
  title?: string;
  description?: string;
  fields?: FormFieldType[];
  data?: any;
  passby?: any;
  submit?: FormSubmit;
}) {
  if (!fields) {
    fields = [];
  }

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const FormSchema = generateFormSchema(fields);
  const defaultValues: Record<string, string> = {};

  fields.forEach((field) => {
    if (field.name) {
      defaultValues[field.name] = data?.[field.name] || field.value || "";
    }
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!submit?.handler) return;

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      setLoading(true);
      const res = await submit.handler(formData, passby);
      setLoading(false);

      if (!res) {
        throw new Error("No response received from server");
      }

      if (res.message) {
        if (res.status === "success") {
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      }

      if (res.redirect_url) {
        router.push(res.redirect_url as any);
      }
    } catch (err: any) {
      console.log("submit form error", err);
      toast.error(err.message || "submit form failed");
      setLoading(false);
    }
  }

  return (
    <FormComponent {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full md:max-w-xl space-y-0 pb-2"
      >
        {/* {title && <h2 className="text-lg font-bold">{title}</h2>}
        {description && <p className="text-muted-foreground">{description}</p>} */}
        <div className="space-y-6 mb-6">
          {fields.map((item, index) => {
            return (
              <FormField
                key={index}
                control={form.control}
                name={item.name || ""}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {item.title}
                      {item.validation?.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      {item.type === "textarea" ? (
                        <Textarea
                          {...(field as any)}
                          placeholder={item.placeholder}
                          {...item.attributes}
                        />
                      ) : item.type === "select" ? (
                        <Select field={item} formField={field} data={data} />
                      ) : item.type === "checkbox" ? (
                        <div className="flex items-center gap-2 flex-wrap ">
                          {item.options?.map((option: any) => (
                            <div
                              key={option.value}
                              className="flex items-center gap-2"
                            >
                              <Checkbox
                                value={option.value}
                                checked={
                                  isArray(field.value)
                                    ? field.value.includes(option.value)
                                    : field.value === option.value
                                }
                                onCheckedChange={(checked) => {
                                  field.onChange(checked);
                                }}
                              />
                              <Label>{option.title}</Label>
                            </div>
                          ))}
                        </div>
                      ) : item.type === "markdown_editor" ? (
                        <Markdown field={item} formField={field} data={data} />
                      ) : (
                        <Input field={item} formField={field} data={data} />
                      )}
                    </FormControl>
                    {item.tip && (
                      <FormDescription
                        dangerouslySetInnerHTML={{ __html: item.tip }}
                      />
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>
        {submit?.button && (
          <Button
            type="submit"
            variant={submit.button.variant}
            className="flex items-center justify-center gap-2 font-semibold cursor-pointer"
            disabled={loading}
            size={submit.button.size || "sm"}
          >
            {loading ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              submit.button.icon && (
                <SmartIcon
                  name={submit.button.icon as string}
                  className="size-4"
                />
              )
            )}
            {submit.button.title}
          </Button>
        )}
      </form>
    </FormComponent>
  );
}

export * from "./form-card";
