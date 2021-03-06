import { useMutation } from '@apollo/client';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { DO_CONSUME } from '../apollo/mutations';
import { ConsumeInput } from '../apollo/schema';
import { useAllStockQuery } from '../apolloActions/useQueries';
import ItemInLocation from '../components/ItemInLocation';
import { Orientation, useOrientation } from '../hooks/useOrientation';
import { RootState } from '../store';

const LocationStockByGroup = ({}: {}) => {
  const { isPortrait, isLandscape } = useOrientation();
  const style = styles({ isPortrait, isLandscape });

  let eventId: string;

  const route = useRoute();
  // @ts-ignore
  const eventIdFromParams: string | undefined = route.params?.eventId;
  if (eventIdFromParams) {
    eventId = eventIdFromParams;
  } else {
    eventId = useSelector((state: RootState) => state.global.eventId);
  }

  const [fetchStock, { loading: loadingStock }] = useAllStockQuery(eventId);
  // @ts-ignore
  const item: Item = route.params?.item;

  const allStock = useSelector((state: RootState) => state.global.allStock);
  const locationStock = allStock.filter((stock) => stock.id === item.id);

  const [createConsumeMutation] = useMutation<ConsumeInput>(DO_CONSUME, {
    onError: (error) => console.log('error', error),
    onCompleted: (data) => {
      // @ts-ignore
      console.log('completed messages:', data.consume.messages);
      // @ts-ignore
      if (data.consume.messages.length > 0) {
        // @ts-ignore
        data.consume.messages.forEach((message) => {
          if (message.__typename === 'ValidationMessage') {
            console.log('error', message.field + ' ' + message.message);
            Toast.show({
              type: 'error',
              text1: 'error',
              text2: message.field + ' ' + message.message,
            });
          }
        });
        fetchStock();
      }
    },
  });

  const renderRow = ({ item }: { item: StockItem }) => {
    return (
      <ItemInLocation
        row={item}
        loading={loadingStock}
        createConsumeMutation={createConsumeMutation}
      />
    );
  };

  return (
    <FlatList
      data={locationStock}
      onRefresh={fetchStock}
      refreshing={loadingStock}
      renderItem={renderRow}
      keyExtractor={(row) => row.locationId}
    />
  );
};

const styles = ({ isPortrait, isLandscape }: Orientation) =>
  StyleSheet.create({
    screen: { alignItems: 'stretch' },
  });

export default LocationStockByGroup;
