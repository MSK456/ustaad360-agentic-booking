import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  IntentReview: { query: string };
  ProviderList: undefined;
  ProviderDetail: { providerId: string };
  BookingConfirm: { providerId: string };
  FollowUpTimeline: { bookingId: string };
  DisputeCenter: undefined;
};

export type TabParamList = {
  Home: undefined;
  AgentTrace: undefined;
  BaselineCompare: undefined;
  DemoScenarios: undefined;
};
