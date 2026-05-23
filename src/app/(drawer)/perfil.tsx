import { View, Text, StyleSheet, Image } from 'react-native';

export default function Perfil() {
  return (
    <View style={styles.container}>

      <Image
        source={{
          uri: 'https://i.ytimg.com/vi/eMb77oBEK9E/oardefault.jpg?sqp=-oaymwEYCNAFENAFSFqQAgHyq4qpAwcIARUAAIhC&rs=AOn4CLBuxMDWpLd2xzXAmhB8pXXY5W5oNw',
        }}
        style={styles.foto}
      />

      <Text style={styles.nome}>Usuário</Text>

      <Text style={styles.email}>
        usuario@email.com
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitulo}>
          Informações
        </Text>

        <Text style={styles.info}>
           Amante de pesca
        </Text>

        <Text style={styles.info}>
           Osasco - SP
        </Text>

        <Text style={styles.info}>
           12 pesqueiros visitados
        </Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#062d5a',
    alignItems: 'center',
    padding: 20,
  },

  foto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: 30,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },

  nome: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },

  email: {
    color: '#ccc',
    marginTop: 5,
    marginBottom: 30,
  },

  card: {
    width: '100%',
    backgroundColor: '#0B3B78',
    padding: 20,
    borderRadius: 20,
  },

  cardTitulo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  info: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
});