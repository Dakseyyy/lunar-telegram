function formatTime(expiresAt) {
    try {
        const now = new Date();
        const expiry = new Date(expiresAt);
        let diffMs = expiry - now;

        if (diffMs <= 0) {
            return { hours: 0, minutes: 0 };
        }

        const msInHour = 1000 * 60 * 60;
        const msInMinute = 1000 * 60;

        const hours = Math.floor(diffMs / msInHour);
        diffMs -= hours * msInHour;

        const minutes = Math.floor(diffMs / msInMinute);
        console.log({hours, minutes})
        return { hours, minutes };
    } catch (e) {
        console.error(e);
        return { hours: 0, minutes: 0 };
    }
}

module.exports = formatTime;
