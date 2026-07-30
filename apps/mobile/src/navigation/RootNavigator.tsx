import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapScreen, PlaceDetailScreen } from '../features/map';
import { CommunityScreen } from '../features/community/CommunityScreen';
import { FriendsScreen } from '../features/friends/FriendsScreen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { CreatePostScreen } from '../features/create/CreatePostScreen';
import { GlassTabBar } from './GlassTabBar';

/** Alt sekmeler — glassmorphism tab bar tarafından çizilir (bkz. GlassTabBar). */
export type TabParamList = {
  Kesfet: undefined;
  Topluluk: undefined;
  ArkadasAra: undefined;
  Profil: undefined;
};

/** Kök stack — sekmelerin üstünde açılan detay ve modal ekranlar. */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  PlaceDetail: { placeId: string };
  CreatePost: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

/** Sekme navigatörü — tab bar'ı özel cam bileşenimiz çizer, header gizli. */
function MainTabs() {
  return (
    <Tab.Navigator
      // Sekmeler arası modern geçiş: hafif yatay kayma + fade.
      screenOptions={{ headerShown: false, animation: 'shift' }}
      tabBar={(props) => <GlassTabBar {...props} />}
    >
      <Tab.Screen name="Kesfet" component={MapScreen} />
      <Tab.Screen name="Topluluk" component={CommunityScreen} />
      <Tab.Screen name="ArkadasAra" component={FriendsScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ title: 'Mekân' }} />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
