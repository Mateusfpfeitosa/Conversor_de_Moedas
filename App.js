import React,{useEffect,useState} from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity,ActivityIndicator,Keyboard } from 'react-native';
import Picker from './src/components/Picker';
import api from './src/services/api'

export default function App() {

  const [moedas,setMoedas] = useState([])
  const [loading,setloading] = useState(true)

  const [moedaSelecionada,setMoedaSelecionada] = useState(null)
  const [moedaBValor,setMoedaBValor] = useState(0)
  
  const [valorMoeda,setValorMoeda] = useState(null)
  const [valorConvertido,setValorConvertido] = useState(0)


  useEffect( ()=>{

    async function loadingMoedas(){
      const response = await api.get('all') 
      let arrayMoedas = []
       Object.keys(response.data).map((key)=>{
        arrayMoedas.push({
          key:key,
          label: key,
          value:key,
        })
       })
       setMoedas(arrayMoedas)
       setloading(false); 
    }
    loadingMoedas()
  },[] )

  async function converter(){
    if(moedaSelecionada === null || moedaBValor === 0){
      alert('Por favor selecione uma moeda')
      return;
    }
    const response = await api.get(`all/${moedaSelecionada}-BRL`);
    //console.log(response.data[moedaSelecionada].ask)

    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor))
    setValorConvertido(`R$ ${resultado.toFixed(2)}`)
    setValorMoeda(moedaBValor)

    Keyboard.dismiss();

  }


  if(loading){
    return(
    <View style={{justifyContent:'center',alignItems:'center',flex: 1}}>
      <ActivityIndicator  color='#FFF' size={45} />
    </View>
    )
  }else{
    
    return (
      <View style={styles.container}>
        <View style={styles.areaMoeda}>
            <Text style={styles.titulo}>Selecione Sua Moeda</Text>
            <Picker moedas={moedas} onChange={(moeda)=> setMoedaSelecionada(moeda)} />
        </View>
        <View style={styles.areaValor}>
            <Text style={styles.titulo}>Digite um valor para converter em (R$)</Text>
            <TextInput
            style={styles.input}
            placeholder='EX: 150'
            keyboardType='numeric'
            onChangeText={ (valor)=> setMoedaBValor(valor) }
            />
        </View>
  
        <TouchableOpacity style={styles.botaoArea} onPress={converter} >
          <Text style={styles.botaoTexto} >Converter</Text>
        </TouchableOpacity>

        {valorConvertido !==0 && (
            <View style={styles.areaResultado}>

              <Text style={styles.valorConvertido}>
                  {valorMoeda} {moedaSelecionada}
              </Text>
              <Text style={[styles.valorConvertido ,{fontSize: 18, margin:10}]}>
                  Corresponde a 
              </Text>
              <Text style={styles.valorConvertido} >
                  {valorConvertido} 
              </Text>
      
            </View>
        )}
          
      </View>
    );

  }

 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    paddingTop: 100,
    backgroundColor:'#1D1D1C'   
  },
  areaMoeda:{
    width:'90%',
    backgroundColor: '#F9f9f9',
    paddingTop:9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    marginBottom: 1 
  },
  titulo:{
    fontSize:15,
    color:'#000',
    paddingLeft:5,
    paddingTop:5
  },
  areaValor:{
    width:'90%',
    backgroundColor: '#F9f9f9',
    paddingBottom:9,
    paddingBottom:9,
  },
  input:{
    width: '100%',
    padding: 10,
    height: 45,
    fontSize: 20,
    marginTop: 9,
    color: '#000'
  },
  botaoArea:{
    width:'90%',
    backgroundColor: '#FB4b57',
    height: 50,
    borderBottomLeftRadius:9,
    borderBottomRightRadius:9,
    justifyContent:'center',
    alignItems:'center'

  },
  botaoTexto:{
    fontSize:18,
    color: '#FFF'
  },
  areaResultado:{
    width:'90%',
    backgroundColor: '#FFF',
    marginTop:25,
    alignItems:'center',
    justifyContent:'center',
    padding: 25
  },
  valorConvertido:{
    fontSize:39,
    fontWeight:'bold',
    color:'#000'
  }



});
