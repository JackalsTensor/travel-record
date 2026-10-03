export type City = { id: string; name: string; province: string; longitude: number; latitude: number };
export type Photo = { id: string; url: string; caption: string };
export type TravelRecord = { id: string; cityId: string; title: string; startDate: string; endDate: string; content: string; places: string[]; photos: Photo[]; createdAt: string };
export type CityState = { cityId: string; planned: boolean };
