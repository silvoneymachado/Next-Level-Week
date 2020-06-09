import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './styles.css'
import logo from '../../assets/logo.svg'
import { FiArrowLeft } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import Dropzone from '../../components/Dropzone';

import axios from 'axios';
import api from '../../services/api';

interface Item {
  id: number,
  title: string,
  image_url: string
}

interface UFIBGE{
  id: number,
  sigla: string,
  nome: string
}

interface UF {
  id: number,
  initials: string,
  name: string
}

interface CityIBGE {
  id: number,
  nome: string
}

interface City {
  id: number,
  name: string
}

interface UserFormData {
  name: string,
  email: string,
  whatsapp: string
}

interface ItemRequest {
  name: string, 
	email: string, 
	whatsapp: string, 
	latitude: number, 
	longitude: number, 
	city: string, 
	uf: string, 
	items: number[]
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<UF[]>([]);
  const [selectedUf, setSelectedUf] = useState('0');
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState('0');
  const [initialPsition, setinitialPosition] = useState<[number,number]>([0, 0])
  const [selectedPsition, setSelectedPosition] = useState<[number,number]>([0, 0])
  const [userFormData, setUserFormData] = useState<UserFormData>({name: '', email: '', whatsapp: ''})
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;

      setinitialPosition([latitude, longitude]);
    })
  }, [])

  useEffect(() => {
    const getItems = () => {
      api.get('items').then(response => {
        setItems(response.data.data)
      })
    }

    getItems();
  }, []);

  useEffect(() => {
    const getUfs = () => {
      axios.get<UFIBGE[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
          setUfs(
              response.data
                .map(uf => ({id: uf.id, initials: uf.sigla, name: uf.nome}))
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
              .map(city => ({id: city.id, name: city.nome}))
          )
        })
    };

    if(selectedUf === '0'){
      return;
    }

    getCityes();
  }, [selectedUf])

  const handleSelectedUf = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedUf(e.target.value);
  }

  const handleSelectedCity = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
  }

  const handleMapclick = (e: LeafletMouseEvent) => {
      setSelectedPosition([e.latlng.lat, e.latlng.lng]);
  }

  const handleImputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value} = e.target;

    setUserFormData({
      ...userFormData,
      [name]: value
    })
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, whatsapp} = userFormData;
    const [latitude, longitude] = selectedPsition;
    const data = new FormData();

    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', selectedUf);
    data.append('city', selectedCity);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', selectedItems.join(','));
    
    if(selectedFile){
      data.append('image', selectedFile);
    }


    const response = await api.post('points', data);

    if(response.data.success){
      alert('Ponto de coleta cadastrado com sucesso!');
      history.push('/');
    } else {
      alert('Deu ruim ao cadastrar ponto.');
    }
  }

  return(
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>

        <Link to="/">
          <FiArrowLeft /> Voltar Para Home
        </Link>
      </header>
      
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do<br /> ponto de coleta</h1>

        <Dropzone onFileUploaded={setSelectedFile}/>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleImputChange}/>
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input type="email" name="email" id="email" onChange={handleImputChange}/>
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" placeholder="+552199999999" onChange={handleImputChange}/>
            </div>
          </div>

        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

          <Map center={initialPsition} zoom={15} onclick={handleMapclick} >
            <TileLayer 
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors" 
             />


             <Marker position={selectedPsition} />
          </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectedUf}>
                <option value="0">Selecione uma UF</option>
                  {ufs.map((uf: UF) => 
                    (<option key={String(uf.id)} value={uf.initials} >{uf.initials}</option>)
                  )}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="uf" value={selectedCity} onChange={handleSelectedCity}>
                <option value="0">Selecione uma cidade</option>
                    {cities.map((city: City) => 
                      (<option key={String(city.id)} value={city.name} >{city.name}</option>)
                    )}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um mais ítens abaixo</span>
          </legend>

          <ul className="items-grid">
            {items.map(item => (
               <li 
                  key={item.id} 
                  onClick={() => handleSelectedItem(item.id)}
                  className={selectedItems.includes(item.id) ? 'selected' : ''}
                >
                 <img src={item.image_url} alt={item.title} />
                 <span>{item.title}</span>
                </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit" onClick={handleSubmit}>Cadastrar ponto de coleta</button>
      </form>
    </div>
  )
}

export default CreatePoint