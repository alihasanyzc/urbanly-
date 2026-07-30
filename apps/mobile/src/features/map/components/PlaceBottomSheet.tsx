import type { Place } from '@urbanly/shared';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../../theme';
import { TAB_BAR_HEIGHT } from '../../../navigation/tabBarLayout';
import { PlaceCard } from './PlaceCard';

interface Props {
  place: Place;
  cardWidth: number;
  onPressDetail: (place: Place) => void;
}

/**
 * Seçili mekânı gösteren, harita üstünde alttan yükselen kart.
 * Mekân değişimi harita marker'larından yapılır; kart içindeki görsel galerisi sağa-sola kaydırılır.
 * `pointerEvents="box-none"` sayesinde kartın dışına yapılan dokunuşlar haritaya geçer (dışa basınca kapanma).
 */
export function PlaceBottomSheet({ place, cardWidth, onPressDetail }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.sheet, { paddingBottom: insets.bottom + TAB_BAR_HEIGHT + theme.spacing(3) }]}
      pointerEvents="box-none"
    >
      <PlaceCard place={place} width={cardWidth} onPressDetail={onPressDetail} />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: theme.spacing(4),
    paddingTop: theme.spacing(2),
  },
});
