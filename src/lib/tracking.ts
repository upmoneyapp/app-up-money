// Utilitários para tracking de conversões e parâmetros UTM
export interface TrackingParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  affiliate_id?: string;
  referrer?: string;
}

// Função para capturar parâmetros UTM da URL
export function getTrackingParams(): TrackingParams {
  if (typeof window === 'undefined') return {};
  
  const urlParams = new URLSearchParams(window.location.search);
  
  return {
    utm_source: urlParams.get('utm_source') || undefined,
    utm_medium: urlParams.get('utm_medium') || undefined,
    utm_campaign: urlParams.get('utm_campaign') || undefined,
    utm_content: urlParams.get('utm_content') || undefined,
    utm_term: urlParams.get('utm_term') || undefined,
    affiliate_id: urlParams.get('affiliate_id') || undefined,
    referrer: document.referrer || undefined,
  };
}

// Função para construir URL de checkout com parâmetros de tracking
export function buildCheckoutUrl(baseUrl: string, trackingParams?: TrackingParams): string {
  const url = new URL(baseUrl);
  
  // Adicionar parâmetros de tracking se fornecidos
  if (trackingParams) {
    Object.entries(trackingParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });
  }
  
  // Adicionar timestamp para tracking único
  url.searchParams.set('timestamp', Date.now().toString());
  
  return url.toString();
}

// Função para salvar dados de conversão (localStorage para persistência)
export function saveConversionData(data: {
  productName: string;
  checkoutUrl: string;
  trackingParams: TrackingParams;
  timestamp: string;
}) {
  if (typeof window === 'undefined') return;
  
  try {
    const conversions = JSON.parse(localStorage.getItem('up_money_conversions') || '[]');
    conversions.push(data);
    
    // Manter apenas os últimos 10 registros
    if (conversions.length > 10) {
      conversions.splice(0, conversions.length - 10);
    }
    
    localStorage.setItem('up_money_conversions', JSON.stringify(conversions));
  } catch (error) {
    console.error('Erro ao salvar dados de conversão:', error);
  }
}

// Função para obter dados de conversão salvos
export function getConversionData() {
  if (typeof window === 'undefined') return [];
  
  try {
    return JSON.parse(localStorage.getItem('up_money_conversions') || '[]');
  } catch (error) {
    console.error('Erro ao obter dados de conversão:', error);
    return [];
  }
}

// Hook personalizado para tracking
export function useTracking() {
  const trackingParams = getTrackingParams();
  
  const trackConversion = (productName: string, baseCheckoutUrl: string) => {
    const checkoutUrl = buildCheckoutUrl(baseCheckoutUrl, trackingParams);
    
    // Salvar dados da conversão
    saveConversionData({
      productName,
      checkoutUrl,
      trackingParams,
      timestamp: new Date().toISOString(),
    });
    
    // Log para debug (remover em produção)
    console.log('🎯 Conversão rastreada:', {
      produto: productName,
      parametros: trackingParams,
      url: checkoutUrl
    });
    
    return checkoutUrl;
  };
  
  return {
    trackingParams,
    trackConversion,
    buildCheckoutUrl: (baseUrl: string) => buildCheckoutUrl(baseUrl, trackingParams)
  };
}

// Constantes para URLs base da Hotmart
export const HOTMART_CHECKOUT_URLS = {
  MONTHLY: 'https://pay.hotmart.com/J102711621S?off=c0c94yc8',
  SEMESTER: 'https://pay.hotmart.com/J102711621S?off=semester2024',
  ANNUAL: 'https://pay.hotmart.com/J102711621S?off=annual2024'
} as const;

// Função para detectar origem do tráfego
export function detectTrafficSource(): string {
  if (typeof window === 'undefined') return 'direct';
  
  const referrer = document.referrer;
  const utm_source = new URLSearchParams(window.location.search).get('utm_source');
  
  if (utm_source) return utm_source;
  
  if (referrer.includes('google.com')) return 'google';
  if (referrer.includes('facebook.com')) return 'facebook';
  if (referrer.includes('instagram.com')) return 'instagram';
  if (referrer.includes('youtube.com')) return 'youtube';
  if (referrer.includes('linkedin.com')) return 'linkedin';
  if (referrer.includes('twitter.com')) return 'twitter';
  if (referrer) return 'referral';
  
  return 'direct';
}