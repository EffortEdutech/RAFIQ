import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { publicColors } from '../src/theme/publicDesignSystem';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    RafiqAmiriQuran: require('../assets/fonts/AmiriQuran-Regular.ttf'),
    RafiqKfgqpcHafs: require('../assets/fonts/KfgqpcHafsUthmanicScriptRegular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: publicColors.forest },
        headerShown: false,
        headerStyle: { backgroundColor: publicColors.deepGreen },
        headerTintColor: publicColors.white,
      }}
    />
  );
}
