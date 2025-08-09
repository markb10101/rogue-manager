import dayjs from 'dayjs';

export const formatTime = (date: Date) => dayjs(date).format('HH:mm:ss');
