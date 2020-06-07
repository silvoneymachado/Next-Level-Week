import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { styles } from './styles';
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from "react-native-svg";

const Points = () => {
  const navigation = useNavigation();
  
  const handleNavigateBack = () => {
    navigation.goBack();
  }

  const handleNavigateToDetail = () => {
    navigation.navigate('Detail');
  }

  return(
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>
        <Text style={styles.title}>😃 Bem Vindo.</Text> 
        <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

        <View style={styles.mapContainer}>
          <MapView 
            style={styles.map}
            initialRegion={{
              latitude: -22.2809342,
              longitude:-42.5329603,
              latitudeDelta: 0.014,
              longitudeDelta: 0.014
            }}
          >
            <Marker 
              coordinate={{
                latitude: -22.2809342,
                longitude:-42.5329603,
              }}
              onPress={handleNavigateToDetail}
             >
               <View style={styles.mapMarkerContainer}>
                <Image 
                    style={styles.mapMarkerImage} 
                    source={{ uri: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'}} 
                />
                <Text style={styles.mapMarkerTitle}>Mercado</Text>
               </View>
               <Icon name="arrow-down" size={20} color="#34cb79"  style={{ marginTop: -4 }}/>
             </Marker>
          </MapView>
        </View>

      </View>
      <View style={styles.itemsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20}}
        >
          <TouchableOpacity style={styles.item} onPress={() => {}} >
            <SvgUri uri="http://10.0.0.100:3333/uploads/lampadas.svg" width={42} height={42} />
            <Text style={styles.itemTitle}>Lampadas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => {}} >
            <SvgUri uri="http://10.0.0.100:3333/uploads/lampadas.svg" width={42} height={42} />
            <Text style={styles.itemTitle}>Lampadas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => {}} >
            <SvgUri uri="http://10.0.0.100:3333/uploads/lampadas.svg" width={42} height={42} />
            <Text style={styles.itemTitle}>Lampadas</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </>
  )
}

export default Points;