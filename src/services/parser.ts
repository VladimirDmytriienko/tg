export function parser(url: string): string | false {
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtu.be')) {
            return urlObj.pathname.substring(1);
        }
        if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
            return urlObj.searchParams.get('v') || false;
        }
    } catch {
        return false;
    }
    return false;
}
