
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/th';
dayjs.extend(utc);

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale('th');

export const formatDateToThai = (inputDate: Date | string): string => {
    return dayjs(inputDate).format('DD MMMM YYYY');
};

export const convertIsoToDate = (isoDate: string): Date => {
    return dayjs(isoDate).toDate();
};

export const convertUtcToLocalDateWithoutTimezone = (utcDate: Date): string => {
    return dayjs(utcDate).local().startOf("day").format('YYYY-MM-DDTHH:mm:ss.SSS');
};