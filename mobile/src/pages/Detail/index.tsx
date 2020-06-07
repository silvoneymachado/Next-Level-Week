import React, {useState, useEffect} from "react";
import { styles } from './styles';
import { View, Text, TouchableOpacity, Image, SafeAreaView, Linking } from "react-native";
import { Feather as Icon, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import * as MailComposer from "expo-mail-composer";
import api from '../../services/api';
interface Params{
  point_id: number
}

interface Point{
  id: number;
  name: string
  image: string,
  email: string,
  whatsapp: string,
  city: string,
  uf: string
};

interface Item{
  title: string
}
interface Data{
  point: Point,
  items: Item[]
};

const Detail = () => {
  const [data, setData] = useState<Data>({} as Data)
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`points/${routeParams.point_id}`).then(response => {
      setData(response.data.data);
    })
  }, [])

  const handleNavigateBack = () => {
    navigation.goBack();
  }

  const handleCmoposeMail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de residuos',
      recipients: [data.point.email]
    })
  }

  const handleWhatsapp = () => {
    Linking.openURL(`whatsapp://send?phone=${data.point.whatsapp}&text=Tenho interesse sobre coleta de resíduos`)
  }

  if(!data.point){
    return null;
  }
  return(
    <SafeAreaView style={{ flex: 1}}>
      <View style={styles.container} >
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image
            style={styles.pointImage}
            source={{ uri: data.point.image}} 
        />
        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => (item.title)).join(', ')}
        </Text>

        <View style={styles.address}>  
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {data.point.city}, {data.point.uf}
          </Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleCmoposeMail}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  ) 
}

export default Detail;