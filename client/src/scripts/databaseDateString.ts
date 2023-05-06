function databaseDateString(ISOstring: string) {
    return `${(new Date(ISOstring)).toISOString().substring(0, 16)}:00`;
}

export default databaseDateString;