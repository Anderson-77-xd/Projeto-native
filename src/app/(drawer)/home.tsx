import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';

import { useRouter } from 'expo-router';

export default function Home() {

  const router = useRouter();

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.ola}>
          👋 Olá, Usuário
        </Text>

        <Text style={styles.subtitulo}>
          Bem-vindo ao app de pesqueiros
        </Text>

      </View>

      {/* BANNER */}

      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200',
        }}

        style={styles.banner}

        imageStyle={{
          borderRadius: 25,
        }}
      >

        <View style={styles.overlay}>

          <Text style={styles.bannerTitle}>
            🎣 Encontre os melhores lugares para pesca
          </Text>

          <TouchableOpacity
            style={styles.bannerButton}

            onPress={() =>
              router.push('/pesqueiros' as any)
            }
          >

            <Text style={styles.bannerButtonText}>
              Ver Pesqueiros
            </Text>

          </TouchableOpacity>

        </View>

      </ImageBackground>

     

      {/* DESTAQUES */}

      <Text style={styles.sectionTitle}>
        🔥 Destaques
      </Text>

      <TouchableOpacity
        style={styles.card}

        onPress={() =>
          router.push('/pesqueiros' as any)
        }
      >

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
          }}

          style={styles.cardImage}
        />

        <View style={styles.cardContent}>

          <Text style={styles.cardTitle}>
            Pesqueiro Lago Azul
          </Text>

          <Text style={styles.cardDescription}>
            Lugar tranquilo para pesca com família
          </Text>

        </View>

      </TouchableOpacity>

      {/* RECOMENDADOS */}

      <Text style={styles.sectionTitle}>
        ⭐ Recomendados
      </Text>

      <TouchableOpacity
        style={styles.card}

        onPress={() =>
          router.push('/pesqueiros' as any)
        }
      >

        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=500',
          }}

          style={styles.cardImage}
        />

        <View style={styles.cardContent}>

          <Text style={styles.cardTitle}>
            Recanto do Pescador
          </Text>

          <Text style={styles.cardDescription}>
            Ótimo ambiente para pescaria esportiva
          </Text>

        </View>

      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#062d5a',
    paddingHorizontal: 20,
  },

  header: {
    marginTop: 20,
    marginBottom: 25,
  },

  ola: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },

  subtitulo: {
    color: '#B8C7E0',
    marginTop: 5,
    fontSize: 16,
  },

  banner: {
    height: 230,
    justifyContent: 'flex-end',
    marginBottom: 30,
  },

  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
    borderRadius: 25,
  },

  bannerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 34,
  },

  bannerButton: {
    backgroundColor: '#0B3B78',
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
  },

  bannerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  categoria: {
    backgroundColor: '#0B3B78',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 30,
    marginRight: 10,
    marginBottom: 30,
  },

  categoriaText: {
    color: '#fff',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#0B3B78',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.3,

    shadowRadius: 4,

    elevation: 5,
  },

  cardImage: {
    width: '100%',
    height: 180,
  },

  cardContent: {
    padding: 15,
  },

  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  cardDescription: {
    color: '#D6E4F0',
    marginTop: 8,
    lineHeight: 22,
  },

});