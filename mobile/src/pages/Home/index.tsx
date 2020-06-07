import React, { useState, useEffect, ChangeEvent} from 'react';
import { Text, View ,Image, ImageBackground } from 'react-native';
import { styles } from './styles';
import { RectButton } from "react-native-gesture-handler";
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface UFIBGE{
  id: number,
  sigla: string,
  nome: string
}

interface UF {
  id: number,
  label: string,
  name: string
  value: string
}

interface CityIBGE {
  id: number,
  nome: string
}

interface City {
  id: number,
  label: string
  value: string,
};

const Home = () => {
  const [ufs, setUfs] = useState<UF[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState('0');
  const navigation = useNavigation();

  useEffect(() => {
    const getUfs = () => {
      axios.get<UFIBGE[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
          setUfs(
              response.data
                .map(uf => ({id: uf.id, label: uf.sigla, name: uf.nome, value: uf.sigla}))
            )
        })
    };
    
    getUfs();
  }, []);

  useEffect(() => {
    const getCityes = () => {
      axios.get<CityIBGE[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(response => {
          setCities(
            response.data
              .map(city => ({id: city.id, label: city.nome, value: city.nome}))
          )
        })
    };

    if(selectedUf === '0'){
      return;
    }

    getCityes();
  }, [selectedUf])

  const handleSelectedUf = (value: string) => {
    setSelectedUf(value);
  }

  const handlenNavigateToPoints = () => {
    navigation.navigate('Points', {city: selectedCity, uf: selectedUf})
  }

  const handleSelectedCity = (value: string) => {
    setSelectedCity(value);
  }

  return(
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{ width: 274, height: 368}}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente </Text>
      </View>

      <View style={styles.select}>  
          <Text style={styles.selectTitle}>Selecione a UF</Text>
          <RNPickerSelect 
            onValueChange={(value) => handleSelectedUf(value)}
            items={ufs}
          />
      </View>

      <View style={styles.select}>  
          <Text style={styles.selectTitle}>Selecione a cidade</Text>
          <RNPickerSelect 
            onValueChange={(value) => handleSelectedCity(value)}
            items={cities}
          />
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handlenNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#fff" size={24} />
          </View>
          <Text style={styles.buttonText}>
            {'Entrar'}
          </Text>
        </RectButton>
      </View>
    </ImageBackground>
  )
}

export default Home;