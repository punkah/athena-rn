import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import NativeScreen from '../components/native/NativeScreen';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { AvailableItemGroup } from '../models/AvailableItemGroup';
import { RootState } from '../store';
import OverviewByItem from './OverviewByItem';

const LocationDetailsOverview = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  const route = useRoute();
  // @ts-ignore
  const location: LogisticLocation = route.params?.location;
  const locationStock = useSelector(
    (state: RootState) => state.global.locationStock[location?.id]
  );
  let availableItems: AvailableItemGroup[] = [];
  if (locationStock) {
    availableItems = locationStock.availableItems;
  }

  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: location?.name,
    });
  }, [navigation]);

  return (
    <NativeScreen style={style.screen}>
      {/* {availableItems.map((group) => (
        <View>
          <NativeText>Group: {group.name}</NativeText>
          {group.children.map((item) => (
            <View>
              <NativeText>
                {item.name} {item.stock}
              </NativeText>
            </View>
          ))}
        </View>
      ))}
       */}
      <OverviewByItem locationId={location?.id} />
    </NativeScreen>
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
  });

export default LocationDetailsOverview;
