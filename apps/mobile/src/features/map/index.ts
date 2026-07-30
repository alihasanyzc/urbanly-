/**
 * Harita özelliğinin dışa açılan yüzeyi (public API).
 * Dış katmanlar (ör. navigation) yalnızca buradan import etmeli; iç dosya yapısı
 * (components/screens/data/utils) özelliğe kapalı kalır.
 */
export { MapScreen } from './screens/MapScreen';
export { PlaceDetailScreen } from './screens/PlaceDetailScreen';

// Mekân verisi — diğer özellikler (ör. Topluluk paylaşımındaki mekân köprüsü) buradan okur,
// map/data içine doğrudan uzanmaz. Backend hazır olunca kaynak burada değişir.
export { MOCK_PLACES } from './data/mockPlaces';
