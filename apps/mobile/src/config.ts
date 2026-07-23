import Constants from 'expo-constants';

/** API taban URL'i app.json > extra.apiUrl'den okunur (ortama göre değişir). */
export const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ?? 'http://localhost:4000/api/v1';
