// Pretty file size formatter used in uploads

export const prettySize = (bytes) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let b = bytes;

    while (b >= 1024 && i < units.length - 1) {
        b /= 1024;
        i++;
    }

    return `${b.toFixed(2)} ${units[i]}`;
};
