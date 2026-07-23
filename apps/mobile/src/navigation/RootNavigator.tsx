import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapScreen } from '../features/map/MapScreen';
import { PlaceDetailScreen } from '../features/map/PlaceDetailScreen';
import { PlacesListScreen } from '../features/places/PlacesListScreen';

export type RootStackParamList = {
  Map: undefined;
  Places: undefined;
  PlaceDetail: { placeId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Map"
        component={MapScreen}
        options={{ title: 'Keşfet', headerShown: false }}
      />
      <Stack.Screen name="Places" component={PlacesListScreen} options={{ title: 'Liste' }} />
      <Stack.Screen
        name="PlaceDetail"
        component={PlaceDetailScreen}
        options={{ title: 'Mekân' }}
      />
    </Stack.Navigator>
  );
}
