import moment from "moment";
import { User as UserType } from "@/shared/services/user";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { cn } from "@/shared/lib/utils";
import { Link } from "@/core/i18n/navigation";

export function User({
  value,
  placeholder,
  metadata,
  className,
}: {
  value: UserType;
  placeholder?: string;
  metadata?: Record<string, any>;
  className?: string;
}) {
  if (!value) {
    if (placeholder) {
      return <div className={className}>{placeholder}</div>;
    }

    return null;
  }

  return (
    <Link
      href={`/admin/users/${value.id}`}
      className={cn("flex items-center gap-2", className)}
    >
      <Avatar className={className}>
        <AvatarImage src={value.image || ""} alt={value.name} />
        <AvatarFallback>{value.name?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
      {value.name}
    </Link>
  );
}
