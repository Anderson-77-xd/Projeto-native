import type { ComponentType } from 'react';
import type { Pesqueiro } from '../../data/pesqueiros';
import type { Coordenada } from '../../hooks/useLocalizacaoUsuario';

declare const MapaGeral: ComponentType<{
  pesqueiros: Pesqueiro[];
  localizacao: Coordenada | null;
  permissaoNegada: boolean;
  distanciaDe: (item: Pesqueiro) => string;
  onSelecionar: (item: Pesqueiro) => void;
}>;

export default MapaGeral;
