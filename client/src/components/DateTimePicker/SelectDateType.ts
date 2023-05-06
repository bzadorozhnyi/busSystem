class SelectDateType {
    year: number;
    month: number;
    day: number;
    hours: number;
    minutes: number;

    constructor(year: number, month: number, day: number, hours: number, minutes: number) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.hours = hours;
        this.minutes = minutes;
    }

    compareTo(other: SelectDateType): number {
        return this.year !== other.year ? (this.year < other.year ? -1 : 1)
            : this.month !== other.month ? (this.month < other.month ? -1 : 1)
            : this.day !== other.day ? (this.day < other.day ? -1 : 1)
            : this.hours !== other.hours ? (this.hours < other.hours ? -1 : 1)
            : this.minutes !== other.minutes ? (this.minutes < other.minutes ? -1 : 1)
            : 0;
    }

    public static fromSelectDateType(date: SelectDateType): SelectDateType {
        return new SelectDateType(date.year, date.month, date.day, date.hours, date.minutes);
    }

    public static fromData(date: Date): SelectDateType {
        return new SelectDateType(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
    }

    public static fromISOString(isoString: string): SelectDateType {
        return SelectDateType.fromData(new Date(isoString));
    }

    toDataBaseISOString(): string {
        const yearString = this.year.toString().padStart(4, '0');
        const monthString = (this.month + 1).toString().padStart(2, '0');
        const dayString = this.day.toString().padStart(2, '0');
        const hoursString = this.hours.toString().padStart(2, '0');
        const minutesString = this.minutes.toString().padStart(2, '0');
        return `${yearString}-${monthString}-${dayString} ${hoursString}:${minutesString}:00`;
      }
      
}

export default SelectDateType;