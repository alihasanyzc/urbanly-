import { useState } from 'react';
import {
  FlatList,
  Image,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import { theme } from '../../theme';

interface Props {
  images: string[];
  width: number;
  height: number;
  borderRadius?: number;
}

/** Sağa-sola kaydırılabilir görsel galerisi + alt nokta göstergesi. */
export function ImageGallery({ images, width, height, borderRadius = 0 }: Props) {
  const [index, setIndex] = useState(0);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  if (images.length === 0) {
    return <View style={{ width, height, backgroundColor: theme.colors.border, borderRadius }} />;
  }

  return (
    <View style={{ width, height }}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(uri, i) => `${uri}-${i}`}
        onMomentumScrollEnd={handleScroll}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width, height, borderRadius }}
            resizeMode="cover"
          />
        )}
      />

      {images.length > 1 && (
        <View style={styles.dots} pointerEvents="none">
          {images.map((uri, i) => (
            <View key={`${uri}-${i}`} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  dots: {
    position: 'absolute',
    bottom: theme.spacing(2),
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  dotActive: { backgroundColor: '#ffffff', width: 18 },
});
