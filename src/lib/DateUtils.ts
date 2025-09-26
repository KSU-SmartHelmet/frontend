export default class DateUtils {
  static formattedNow(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}_${hour}${minute}${second}`;
  };

  static getFormatDateTime(originTime: Date): string {
    const year = originTime.getFullYear();
    const month = (originTime.getMonth() + 1).toString().padStart(2, '0');
    const day = originTime.getDate().toString().padStart(2, '0');

    const hour = originTime.getHours().toString().padStart(2, '0');
    const minute = originTime.getMinutes().toString().padStart(2, '0');
    const second = originTime.getSeconds().toString().padStart(2, '0');
    return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
  };
}