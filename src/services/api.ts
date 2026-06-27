import { Platform } from 'react-native';
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

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/v1' : 'http://localhost:8080/api/v1');

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
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
  return request<Usuario>('/usuario/login', {
    method: 'POST',
    body: JSON.stringify({ email, senha }),
  });
}
