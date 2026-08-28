import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pesqueiros as pesqueirosLocais, Pesqueiro } from '../data/pesqueiros';

export type Usuario = {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  nivelAcesso?: string;
  statusUsuario?: boolean;
  dataCadastro?: string;
};

type RespostaLogin = {
  token: string;
  usuario: Usuario;
};

export type Comentario = {
  id: number;
  descricao: string;
  pesqueiroId: number;
  usuarioId: number;
  dataCadastro: string;
  nota: number;
};

type PesqueiroApi = {
  id?: number;
  nome?: string;
  telefone?: string;
  descricao?: string;
  informacao?: string;
  foto?: string | null;
  cep?: string;
  numero?: string;
  complemento?: string;
  statusPesqueiro?: boolean;
};

export type Peixe = {
  id: number;
  nome: string;
  descricao?: string;
  statusPeixe?: boolean;
};

type CatalogoApi = {
  id: number;
  peixeId: string;
  pesqueiroId: string;
  statusCatalogo?: boolean;
};

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/v1' : 'http://localhost:8080/api/v1');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers, ...requestOptions } = options ?? {};
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message ?? 'Erro ao conectar com o servidor.');
  }

  return data as T;
}

function fotoParaImagem(foto?: string | null) {
  if (!foto) {
    return 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600';
  }

  if (foto.startsWith('http')) {
    return foto;
  }

  return `data:image/jpeg;base64,${foto}`;
}

function adaptarPesqueiro(item: PesqueiroApi, index: number): Pesqueiro {
  const local = pesqueirosLocais[index % pesqueirosLocais.length];

  return {
    ...local,
    id: String(item.id ?? local.id),
    nome: item.nome ?? local.nome,
    cidade: item.complemento || item.cep || local.cidade,
    estado: 'SP',
    imagem: fotoParaImagem(item.foto),
    descricao: item.descricao || item.informacao || local.descricao,
    categoria: item.statusPesqueiro === false ? 'Inativo' : local.categoria,
    telefone: item.telefone,
  };
}

export async function listarPesqueiros(): Promise<Pesqueiro[]> {
  const data = await request<PesqueiroApi[]>('/pesqueiro');
  return data.map(adaptarPesqueiro);
}

export async function cadastrarUsuario(nome: string, email: string, senha: string) {
  return request<Usuario>('/usuario', {
    method: 'POST',
    body: JSON.stringify({
      nome,
      email,
      senha,
      nivelAcesso: 'CLIENTE',
      statusUsuario: true,
      dataCadastro: new Date().toISOString().slice(0, 10),
    }),
  });
}

export async function loginUsuario(email: string, senha: string) {
  return request<RespostaLogin>('/usuario/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}

export async function esqueciSenha(email: string) {
  return request<{ message: string }>('/usuario/esqueci-senha', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function redefinirSenha(token: string, novaSenha: string) {
  return request<{ message: string }>('/usuario/redefinir-senha', {
    method: 'POST',
    body: JSON.stringify({ token, novaSenha }),
  });
}

async function requestAutenticado<T>(path: string, options?: RequestInit): Promise<T> {
  const token = await AsyncStorage.getItem('@smartfishing:token');
  if (!token) {
    throw new Error('Faça login para enviar uma avaliação.');
  }

  return request<T>(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options?.headers,
    },
  });
}

export async function listarComentarios(pesqueiroId?: string | number): Promise<Comentario[]> {
  const comentarios = await request<Comentario[]>('/comentario');
  return comentarios
    .filter((comentario) => pesqueiroId === undefined || String(comentario.pesqueiroId) === String(pesqueiroId))
    .sort((a, b) => new Date(b.dataCadastro).getTime() - new Date(a.dataCadastro).getTime());
}

export async function criarComentario(pesqueiroId: string | number, nota: number, descricao: string) {
  return requestAutenticado<Comentario>('/comentario', {
    method: 'POST',
    body: JSON.stringify({
      pesqueiroId: Number(pesqueiroId),
      nota,
      descricao,
      dataCadastro: new Date().toISOString().slice(0, 10),
    }),
  });
}

export async function listarFavoritos(): Promise<Pesqueiro[]> {
  const data = await requestAutenticado<PesqueiroApi[]>('/favorito');
  return data.map(adaptarPesqueiro);
}

export async function favoritarPesqueiro(pesqueiroId: string | number) {
  return requestAutenticado('/favorito', {
    method: 'POST',
    body: JSON.stringify({ pesqueiroId: Number(pesqueiroId) }),
  });
}

export async function desfavoritarPesqueiro(pesqueiroId: string | number) {
  return requestAutenticado(`/favorito/pesqueiro/${pesqueiroId}`, { method: 'DELETE' });
}

export async function registrarVisita(pesqueiroId: string | number) {
  const token = await AsyncStorage.getItem('@smartfishing:token');
  if (!token) {
    return;
  }

  try {
    await request('/historico', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pesqueiroId: Number(pesqueiroId) }),
    });
  } catch {
    // Registrar a visita é um efeito colateral: uma falha aqui não deve atrapalhar a navegação.
  }
}

export async function listarHistorico(): Promise<Pesqueiro[]> {
  const data = await requestAutenticado<PesqueiroApi[]>('/historico');
  return data.map(adaptarPesqueiro);
}

export async function denunciarComentario(comentarioId: number) {
  return requestAutenticado('/denuncia', {
    method: 'POST',
    body: JSON.stringify({ comentarioId }),
  });
}

export async function listarEspeciesPorPesqueiro(pesqueiroId: string | number): Promise<Peixe[]> {
  const [catalogo, peixes] = await Promise.all([
    request<CatalogoApi[]>('/catalogo'),
    request<Peixe[]>('/peixe'),
  ]);

  const peixesPorId = new Map(peixes.map((peixe) => [String(peixe.id), peixe]));

  return catalogo
    .filter((item) => String(item.pesqueiroId) === String(pesqueiroId) && item.statusCatalogo !== false)
    .map((item) => peixesPorId.get(String(item.peixeId)))
    .filter((peixe): peixe is Peixe => !!peixe);
}
