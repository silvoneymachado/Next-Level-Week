import React, { useState, useEffect} from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, Alert } from "react-native";
import { styles } from './styles';
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from "react-native-svg";
import * as Location from "expo-location";
import api from '../../services/api';

interface Item{
  id: number,
  title: string,
  image_url: string
}

interface Point{
  id: number;
  name: string
  image: string,
  latitude: number,
  longitude: number,
}
interface Params{
  city: string,
  uf: string
}

const Points = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [points, setPoints] = useState<Point[]>([])
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number]>([0,0])
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    const getUserPosition = async () => {
      const { status } = await Location.requestPermissionsAsync();

      if(status !== 'granted'){
        Alert.alert('Oooops...', 'Precisamos de sua permissão para obter a localização')
        return
      }
      const position = await Location.getCurrentPositionAsync();
      setUserPosition([position.coords.latitude, position.coords.longitude])
    }
    getUserPosition();
  }, []);

  useEffect(() => {
    const getItems = () => {
      api.get('items').then(response=> {
        setItems(response.data.data);
      })
    };

    getItems();
  }, [])

  useEffect(() => {
    console.log({
      city: routeParams.city,
      uf: routeParams.uf,
      items: selectedItems
    })
    const getPoints = () => {
      api.get('points', {
        params: {
          city: routeParams.city,
          uf: routeParams.uf,
          items: selectedItems
        }
      }).then(response => {
        setPoints(response.data.data)
      })
    };

    getPoints()
  }, [selectedItems])
  
  const handleNavigateBack = () => {
    navigation.goBack();
  }

  const handleNavigateToDetail = (id: number) => {
    navigation.navigate('Detail', { point_id: id});
  }

  const handleSelectedItem = (id:number) => {
    const alreadySelected = selectedItems.findIndex(item => item === id);

    if(alreadySelected >= 0){
      const filteredItems = selectedItems.filter(item => item !== id);

      setSelectedItems(filteredItems)
    }else{
      setSelectedItems([...selectedItems, id])
    }

  }

  return(
    <SafeAreaView style={{ flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title}>😃 Bem Vindo.</Text> 
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          { userPosition[0] !== 0 && (
            <MapView 
              style={styles.map}
              initialRegion={{
                latitude: userPosition[0],
                longitude: userPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014
              }}
            >
              {points.map(point => (
                <Marker
                  key={String(point.id)}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() => handleNavigateToDetail(point.id)}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image 
                        style={styles.mapMarkerImage} 
                        source={{ uri: point.image}} 
                    />
                    <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                  </View>
                  <Icon name="arrow-down" size={20} color="#34cb79"  style={{ marginTop: -4 }}/>
                </Marker>
              ))}
            </MapView>

          )}
        </View>

      </View>
      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20}}
        >
          {items.map(item => (
            <TouchableOpacity 
              key={String(item.id)} 
              style={[styles.item, selectedItems.includes(item.id) ? styles.selectedItem : {}]} 
              onPress={() => handleSelectedItem(item.id)}
              activeOpacity={0.6}
            >
              <SvgUri uri={item.image_url} width={42} height={42} />
              <Text style={styles.itemTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}          
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default Points;