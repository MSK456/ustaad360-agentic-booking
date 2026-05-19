import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  IntentReview: { query: string };
  ProviderList: undefined;
  ProviderDetail: { providerId: string };
  BookingConfirm: { providerId: string };
  FollowUpTimeline: { bookingId: string };
  MyBookings: undefined;
  DisputeCenter: undefined;
};

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
  Home: undefined;
  AgentTrace: undefined;
  BaselineCompare: undefined;
  DemoScenarios: undefined;
};
