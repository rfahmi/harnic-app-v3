import React, {memo} from 'react';
import ScrollableTabView, {
  ScrollableTabBar,
} from 'react-native-scrollable-tab-view';
import HeaderBack from '../../../components/HeaderBack';
import TransactionList from './TransactionList';

const UserTransaction = ({navigation, route}) => {
  const {user_id, init} = route.params;

  return (
    <>
      <HeaderBack title="Pesanan" styles={{elevation: 0}} search={false} />
      <ScrollableTabView
        initialPage={init || 0}
        renderTabBar={() => (
          <ScrollableTabBar
            backgroundColor="rgba(255, 255, 255, 0.7)"
            activeTextColor="#1100BB"
          />
        )}>
        <TransactionList tabLabel="Baru" status="0,1,2" user={user_id} />
        <TransactionList tabLabel="Disiapkan" status="3" user={user_id} />
        <TransactionList tabLabel="Dikirim" status="4" user={user_id} />
        <TransactionList tabLabel="Diterima" status="5" user={user_id} />
        <TransactionList tabLabel="Selesai" status="6,7" user={user_id} />
        <TransactionList tabLabel="Semua" status="all" user={user_id} />
        <TransactionList tabLabel="Batal" status="8,9" user={user_id} />
      </ScrollableTabView>
    </>
  );
};

export default memo(UserTransaction);
