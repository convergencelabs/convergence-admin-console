import moment from "moment";

export class DateUtils {

  private static dataFormat: string = "MM/DD/YYYY hh:mm:ss.SSS A";

  public static formatDate(date: Date): string {
    const dateStr = moment(date).format(DateUtils.dataFormat);
    return dateStr;
  }

  public static parseDate(value: string): Date {
    return moment(value).utc().toDate();
  }

  public static validate(value: string): boolean {
    return moment(value, DateUtils.dataFormat, true).isValid();
  }
}