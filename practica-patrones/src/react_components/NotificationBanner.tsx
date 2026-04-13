interface INotificationBannerProps {
    readonly message: string | null;
}

export function NotificationBanner({ message }: INotificationBannerProps) {
    return (
        <div className={`notify-banner ${message ? 'is-visible' : ''}`}>
            {message}
        </div>
    );
}
