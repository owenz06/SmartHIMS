import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useInitials } from '@/hooks/use-initials';
import { getRoleDisplayName, getRoleBadgeColor } from '@/config/navigation';
import type { User } from '@/types';

export function UserInfo({
    user,
    showEmail = false,
    showRole = false,
}: {
    user: User | null;
    showEmail?: boolean;
    showRole?: boolean;
}) {
    const getInitials = useInitials();

    if (!user) {
        return null;
    }

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name || '')}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {showEmail && (
                    <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                    </span>
                )}
                {showRole && user.role && (
                    <Badge 
                        variant="secondary" 
                        className={`mt-1 w-fit text-xs ${getRoleBadgeColor(user.role)}`}
                    >
                        {getRoleDisplayName(user.role)}
                    </Badge>
                )}
            </div>
        </>
    );
}
