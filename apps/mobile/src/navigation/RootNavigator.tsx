import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapScreen, PlaceDetailScreen } from '../features/map';
import { CommunityScreen } from '../features/community/CommunityScreen';
import { CommentsModalScreen } from '../features/community/comments-modal-screen';
import { ProfileScreen } from '../features/profile/ProfileScreen';
import { CreatePostScreen } from '../features/create/CreatePostScreen';
import { TravelCompanionDetailScreen } from '../features/travel-companions/travel-companion-detail-screen';
import { TravelCompanionsScreen } from '../features/travel-companions/travel-companions-screen';
import { GlassTabBar } from './GlassTabBar';

/** Alt sekmeler — glassmorphism tab bar tarafından çizilir (bkz. GlassTabBar). */
export type TabParamList = {
  Kesfet: undefined;
  Topluluk: undefined;
  YolArkadasi: undefined;
  Profil: undefined;
};

/** Kök stack — sekmelerin üstünde açılan detay ve modal ekranlar. */
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList> | undefined;
  PlaceDetail: { placeId: string };
  CreatePost: undefined;
  PostComments: { postId: string };
  TravelCompanionDetail: { planId: string };
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
      <Tab.Screen name="YolArkadasi" component={TravelCompanionsScreen} />
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
      <Stack.Screen
        name="PostComments"
        component={CommentsModalScreen}
        options={{ presentation: 'modal', headerShown: false }}
      />
      <Stack.Screen
        name="TravelCompanionDetail"
        component={TravelCompanionDetailScreen}
        options={{ title: 'Seyahat Detayı', headerBackButtonDisplayMode: 'minimal' }}
      />
    </Stack.Navigator>
  );
}
