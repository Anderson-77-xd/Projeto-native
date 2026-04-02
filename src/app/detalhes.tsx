import { View, Text, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Detalhes() {
  const { nome, cidade, imagem,descricao, preco, horario} = useLocalSearchParams();

  const imagemUrl = Array.isArray(imagem) ? imagem[0] : imagem;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imagemUrl }} style={styles.imagem} />

     <Text style={styles.nome}>{nome}</Text>
<Text style={styles.cidade}>{cidade}</Text>

    
     
<Text style={styles.info}> {descricao}</Text>
<Text style={styles.info}> {preco}</Text>
<Text style={styles.info}> {horario}</Text>

    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 20,
  },
  imagem: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  nome: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 15,
  },
  cidade: {
    color: '#ccc',
    marginTop: 5,
  },
  info: {
  color: '#ccc',
  marginTop: 8,
  fontSize: 16,
},
});