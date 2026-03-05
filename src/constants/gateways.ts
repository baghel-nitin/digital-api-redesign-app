export const GATEWAY_LOGOS: Record<string, string> = {
  APIGEEX: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-APIGEEX.webp',
  AWS: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-AWS.webp',
  AZURE: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-AZURE.webp',
  HELIX_GATEWAY: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-HELIX_GATEWAY.webp',
  KONG: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-KONG.webp',
  MULESOFT: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-MULESOFT.webp',
  IBM_API_CONNECT: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-IBM_API_CONNECT.webp',
  TYK: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-TYK.webp',
  WSO2: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-WSO2.webp',
  BROADCOM: 'https://try-helix.digitalapi.ai/assets/images/gateways/gw-BROADCOM.webp',
}

export const AVAILABLE_GATEWAYS = [
  { id: 'APIGEEX', name: 'Apigee X', comingSoon: false },
  { id: 'AWS', name: 'AWS', comingSoon: false },
  { id: 'AZURE', name: 'Azure', comingSoon: false },
  { id: 'HELIX_GATEWAY', name: 'Helix Gateway', comingSoon: false },
  { id: 'KONG', name: 'Kong', comingSoon: false },
  { id: 'MULESOFT', name: 'Mulesoft', comingSoon: false },
  { id: 'IBM_API_CONNECT', name: 'IBM API Connect', comingSoon: true },
  { id: 'TYK', name: 'Tyk', comingSoon: true },
  { id: 'WSO2', name: 'WSO2', comingSoon: true },
  { id: 'BROADCOM', name: 'Layer 7', comingSoon: true },
]
