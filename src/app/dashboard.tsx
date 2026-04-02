import { View, Text, StyleSheet, FlatList,TouchableOpacity, } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../components/Button';
import { Image } from 'react-native';

export default function Dashboard() {
    const router = useRouter();
  const pesqueiros = [
    { id: '1', 
    nome: 'Pesqueiro Lago Azul', 
    cidade: 'Osasco',
  imagem: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=300',
  descricao: 'Lugar tranquilo para pesca com família',
    preco: 'R$ 30',
    horario: '08:00 - 18:00',
  
},
    { id: '2', nome: 'Pesqueiro do Zé', cidade: 'Barueri',
        imagem: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=300',
        descricao: 'Lugar tranquilo para pesca com família',
    preco: 'R$ 30',
    horario: '08:00 - 18:00',
     },
    { id: '3', nome: 'Recanto do Pescador', cidade: 'São Paulo',
        imagem: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=300',
        descricao: 'Lugar tranquilo para pesca com família',
    preco: 'R$ 30',
    horario: '08:00 - 18:00',
     },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}> Pesqueiros</Text>

  

    
      <FlatList
        data={pesqueiros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
         <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: '/detalhes',
                params: item,
              })
            }
          >
            <Image source={{ uri: item.imagem }} style={styles.imagem} />
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.cidade}>{item.cidade}</Text>
           
          </TouchableOpacity>
          
          </View>
        )}
      />


       <Button
        title="Voltar para Login"
        onPress={() => router.replace('/')}
          />
    </View>
     
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#076e4f',
    padding: 20,
  },
  titulo: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#046583',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  nome: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cidade: {
    color: '#ccc',
    marginTop: 5,
  },
  imagem: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
});