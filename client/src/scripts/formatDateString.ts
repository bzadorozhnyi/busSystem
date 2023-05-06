function formatDateString(isoString: string) {
    const date = new Date(isoString);
    const time = date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
    const dateString = date.toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return `${time} ${dateString}`;
}

export default formatDateString;