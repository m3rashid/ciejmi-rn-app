import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants';
import OptionList from '../../components/OptionList/OptionList';
import InternetConnectionAlert from 'react-native-internet-connection-alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProgressDialog from 'react-native-progress-dialog';
import easybuylogo from '../../assets/logo/logo.png';

const DashboardScreen = ({ navigation, route }) => {
  const { authUser } = route.params;
  const [user, setUser] = useState(authUser);
  const [label, setLabel] = useState('Loading . . .');
  const [error, setError] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState([]);
  const [refeshing, setRefreshing] = useState(false);

  //method to remove the auth user from async storage and navigate the login if token expires
  const logout = async () => {
    await AsyncStorage.removeItem('authUser');
    navigation.replace('login');
  };

  var myHeaders = new Headers();
  myHeaders.append('x-auth-token', authUser.token);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow',
  };

  //method the fetch the statistics from server using API call
  const fetchStats = () => {
    fetch(`${network.serverip}/dashboard`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.success == true) {
          //set the fetched data to Data state
          setData([
            {
              id: 1,
              title: 'Users',
              value: result.data?.usersCount,
              iconName: 'person',
              type: 'parimary',
              screenName: 'viewusers',
            },
            {
              id: 2,
              title: 'Orders',
              value: result.data?.ordersCount,
              iconName: 'cart',
              type: 'secondary',
              screenName: 'vieworder',
            },
            {
              id: 3,
              title: 'Products',
              value: result.data?.productsCount,
              iconName: 'md-square',
              type: 'warning',
              screenName: 'viewproduct',
            },
            {
              id: 4,
              title: 'Categories',
              value: result.data?.categoriesCount,
              iconName: 'menu',
              type: 'muted',
              screenName: 'viewcategories',
            },
          ]);
          setError('');
          setIsloading(false);
        } else {
          console.log(result.err);
          if (result.err == 'jwt expired') {
            logout();
          }
          setError(result.message);
          setIsloading(false);
        }
      })
      .catch(error => {
        setError(error.message);
        console.log('error', error);
        setIsloading(false);
      });
  };

  const handleOnRefresh = () => {
    setRefreshing(true);
    fetchStats();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    return Alert.alert(
      'Logout from CIE-JMI ?',
      'Are you sure you want to logout ?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('authUser');
            navigation.replace('login');
          },
        },
      ],
    );
  }

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <InternetConnectionAlert>
      <View style={styles.container}>
        <StatusBar />
        <ProgressDialog visible={isloading} label={label} />
        <View style={styles.topBarContainer}>
          <TouchableOpacity
            onPress={handleLogout}>
            <Ionicons name="log-out" size={30} color={colors.muted} />
          </TouchableOpacity>

          <View style={styles.topbarlogoContainer}>
            <Image source={easybuylogo} style={styles.logo} />
            <Text style={styles.toBarText}>CIE-JMI</Text>
          </View>
        </View>


        <View style={styles.headingContainer}>
          <Text style={styles.headingText}>Welcome, Admin</Text>
        </View>

        <View style={{ flex: 1, width: '103%' }}>
          <ScrollView style={styles.actionContainer}>
            <OptionList
              text='Products'
              Icon={Ionicons}
              iconName='md-square'
              onPress={() =>
                navigation.navigate('viewproduct', { authUser: user })
              }
              onPressSecondary={() =>
                navigation.navigate('addproduct', { authUser: user })
              }
              type="morden"
            />
            <OptionList
              text='Categories'
              Icon={Ionicons}
              iconName='menu'
              onPress={() =>
                navigation.navigate('viewcategories', { authUser: user })
              }
              onPressSecondary={() =>
                navigation.navigate('addcategories', { authUser: user })
              }
              type="morden"
            />
            <OptionList
              text='Orders'
              Icon={Ionicons}
              iconName='cart'
              onPress={() =>
                navigation.navigate('vieworder', { authUser: user })
              }
              type="morden"
            />
            <OptionList
              text='Users'
              Icon={Ionicons}
              iconName='person'
              onPress={() =>
                navigation.navigate('viewusers', { authUser: user })
              }
              type="morden"
            />

            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </InternetConnectionAlert>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  topbarlogoContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  logo: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
  },
  toBarText: {
    fontSize: 20,
    fontWeight: '600',
  },
  container: {
    width: '100%',
    flexDirecion: 'row',
    backgroundColor: colors.light,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 0,
    flex: 1,
  },
  topBarContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  toBarText: {
    fontSize: 15,
    fontWeight: '600',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
  },
  bodyContainer: {
    width: '100%',
  },
  headingContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
  },
  headingText: {
    fontSize: 20,
    color: colors.muted,
    fontWeight: '800',
    paddingLeft: 10,
  },
  actionContainer: { padding: 20, width: '100%', flex: 1 },
});
