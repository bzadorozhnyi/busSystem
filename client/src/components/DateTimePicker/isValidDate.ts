function isValidDate(year: number, month: number, day: number) {
    let d = new Date(year, month, day);
    return (d.getFullYear() == year && d.getMonth() == month && d.getDate() == day);
}

export default isValidDate;