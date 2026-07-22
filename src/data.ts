import type { Faq, Product } from './types'

export const products: Product[] = [
  {
    id: 'ch-212', brand: 'Carolina Herrera', name: '212 VIP Rosé Elixir',
    subtitle: { es: 'Eau de Parfum · 50 ml', pt: 'Eau de Parfum · 50 ml', en: 'Eau de Parfum · 50 ml' },
    category: 'perfumes', image: 'img/ch-212.jpeg', price: 89, originalPrice: 109, stock: 8, featured: true,
    description: {
      es: 'Una fragancia floral intensa y luminosa, perfecta para celebrar cada viaje.',
      pt: 'Uma fragrância floral intensa e luminosa, perfeita para celebrar cada viagem.',
      en: 'A radiant, intense floral fragrance made to celebrate every journey.',
    },
  },
  {
    id: 'armani-way', brand: 'Giorgio Armani', name: 'My Way',
    subtitle: { es: 'Eau de Parfum · 90 ml', pt: 'Eau de Parfum · 90 ml', en: 'Eau de Parfum · 90 ml' },
    category: 'perfumes', image: 'img/armani-way.jpeg', price: 118, stock: 5, featured: true,
    description: {
      es: 'Un bouquet floral contemporáneo con notas de azahar y vainilla.',
      pt: 'Um buquê floral contemporâneo com notas de flor de laranjeira e baunilha.',
      en: 'A contemporary floral bouquet with orange blossom and vanilla notes.',
    },
  },
  {
    id: 'amor-amor', brand: 'Cacharel', name: 'Amor Amor',
    subtitle: { es: 'Eau de Toilette · 50 ml', pt: 'Eau de Toilette · 50 ml', en: 'Eau de Toilette · 50 ml' },
    category: 'perfumes', image: 'img/amor-amor.jpeg', price: 64, originalPrice: 76, stock: 12, featured: true,
    description: {
      es: 'Frutal y vibrante, un clásico joven con personalidad.',
      pt: 'Frutado e vibrante, um clássico jovem com personalidade.',
      en: 'A vibrant fruity fragrance and a youthful classic with personality.',
    },
  },
  {
    id: 'moncler-sunrise', brand: 'Moncler', name: 'Sunrise Pour Homme',
    subtitle: { es: 'Eau de Parfum · 100 ml', pt: 'Eau de Parfum · 100 ml', en: 'Eau de Parfum · 100 ml' },
    category: 'perfumes', image: 'img/moncler-sunrise.jpeg', price: 132, stock: 3, featured: true,
    description: {
      es: 'Amaderada y sofisticada, inspirada en la energía de la montaña.',
      pt: 'Amadeirada e sofisticada, inspirada na energia da montanha.',
      en: 'A sophisticated woody fragrance inspired by the energy of the mountains.',
    },
  },
  {
    id: 'chivas-12', brand: 'Chivas Regal', name: 'Chivas Regal 12 Years',
    subtitle: { es: 'Blended Scotch Whisky · 1 L', pt: 'Blended Scotch Whisky · 1 L', en: 'Blended Scotch Whisky · 1 L' },
    category: 'bebidas', image: 'img/chivas-12.png', price: 39, originalPrice: 46, stock: 18, featured: true,
    description: {
      es: 'Whisky escocés suave, con notas de miel, vainilla y frutas maduras.',
      pt: 'Whisky escocês suave, com notas de mel, baunilha e frutas maduras.',
      en: 'A smooth Scotch whisky with honey, vanilla and ripe-fruit notes.',
    },
  },
  {
    id: 'jw-black', brand: 'Johnnie Walker', name: 'Black Label 12 Years',
    subtitle: { es: 'Blended Scotch Whisky · 1 L', pt: 'Blended Scotch Whisky · 1 L', en: 'Blended Scotch Whisky · 1 L' },
    category: 'bebidas', image: 'img/jw-black.png', price: 42, stock: 14,
    description: { es: 'Profundo y equilibrado, con carácter ahumado.', pt: 'Profundo e equilibrado, com caráter defumado.', en: 'Deep and balanced, with a distinctive smoky character.' },
  },
  {
    id: 'jager', brand: 'Jägermeister', name: 'Herb Liqueur',
    subtitle: { es: 'Licor de hierbas · 1 L', pt: 'Licor de ervas · 1 L', en: 'Herbal liqueur · 1 L' },
    category: 'bebidas', image: 'img/jager.png', price: 25, stock: 10,
    description: { es: 'La receta icónica de 56 botánicos.', pt: 'A receita icônica de 56 botânicos.', en: 'The iconic recipe made with 56 botanicals.' },
  },
  {
    id: 'amarula', brand: 'Amarula', name: 'Cream Liqueur',
    subtitle: { es: 'Licor crema · 750 ml', pt: 'Licor cremoso · 750 ml', en: 'Cream liqueur · 750 ml' },
    category: 'bebidas', image: 'img/amarula.png', price: 18, stock: 16,
    description: { es: 'Cremoso y suave, elaborado con fruta marula.', pt: 'Cremoso e suave, elaborado com a fruta marula.', en: 'Smooth and creamy, made with marula fruit.' },
  },
  {
    id: 'lindt-gold', brand: 'Lindt', name: 'Swiss Luxury Selection',
    subtitle: { es: 'Bombones surtidos · 230 g', pt: 'Bombons sortidos · 230 g', en: 'Assorted chocolates · 230 g' },
    category: 'delicatessen', image: 'img/lindt-gold.png', price: 22, stock: 20,
    description: { es: 'Selección premium de chocolates suizos.', pt: 'Seleção premium de chocolates suíços.', en: 'A premium selection of Swiss chocolates.' },
  },
  {
    id: 'airpods', brand: 'Apple', name: 'AirPods Pro',
    subtitle: { es: '2ª generación · USB-C', pt: '2ª geração · USB-C', en: '2nd generation · USB-C' },
    category: 'tecnologia', image: 'img/airpods.png', price: 249, stock: 4,
    description: { es: 'Audio adaptativo y cancelación activa de ruido.', pt: 'Áudio adaptativo e cancelamento ativo de ruído.', en: 'Adaptive audio and active noise cancellation.' },
  },
]

/**
 * Preguntas y respuestas oficiales adaptadas de
 * dutyfreeshoppuertoiguazu.com/preguntas-frecuentes/.
 * No se inventan respuestas: el chatbot solo busca dentro de este conjunto.
 */
export const faqs: Faq[] = [
  {
    id: 'location',
    question: { es: '¿Dónde se encuentra Duty Free Shop Puerto Iguazú?', pt: 'Onde fica o Duty Free Shop Puerto Iguazú?', en: 'Where is Duty Free Shop Puerto Iguazú located?' },
    answer: {
      es: 'Está ubicado en Ruta Nacional 12, km 1645,5, Paso de Frontera, Puerto Iguazú, Misiones, Argentina.',
      pt: 'Fica na Ruta Nacional 12, km 1645,5, passagem de fronteira, Puerto Iguazú, Misiones, Argentina.',
      en: 'It is located on National Route 12, km 1645.5, at the border crossing in Puerto Iguazú, Misiones, Argentina.',
    },
    keywords: { es: ['donde', 'ubicacion', 'direccion', 'llegar'], pt: ['onde', 'localizacao', 'endereco', 'chegar'], en: ['where', 'location', 'address', 'directions'] },
  },
  {
    id: 'hours',
    question: { es: '¿Qué días y horarios abre?', pt: 'Quais são os dias e horários de funcionamento?', en: 'What days and hours is the store open?' },
    answer: {
      es: 'Abrimos todo el año: domingos a jueves de 12:00 a 20:00 y viernes y sábados de 12:00 a 21:00, hora argentina.',
      pt: 'Abrimos o ano todo: de domingo a quinta, das 12h às 20h; sextas e sábados, das 12h às 21h, horário argentino.',
      en: 'We are open year-round: Sunday through Thursday from 12:00 to 20:00, and Friday and Saturday from 12:00 to 21:00, Argentina time.',
    },
    keywords: { es: ['horario', 'hora', 'abre', 'cierra', 'dias'], pt: ['horario', 'hora', 'abre', 'fecha', 'dias'], en: ['hours', 'open', 'close', 'days', 'time'] },
  },
  {
    id: 'shipping',
    question: { es: '¿Hacen envíos al interior o a países limítrofes?', pt: 'Fazem entregas no país ou em países vizinhos?', en: 'Do you ship within Argentina or to neighboring countries?' },
    answer: { es: 'Duty Free Shop Puerto Iguazú no realiza envíos a domicilio.', pt: 'O Duty Free Shop Puerto Iguazú não realiza entregas em domicílio.', en: 'Duty Free Shop Puerto Iguazú does not offer home delivery.' },
    keywords: { es: ['envio', 'domicilio', 'enviar'], pt: ['envio', 'entrega', 'domicilio'], en: ['shipping', 'delivery', 'ship'] },
  },
  {
    id: 'payment',
    question: { es: '¿Qué medios de pago aceptan?', pt: 'Quais meios de pagamento são aceitos?', en: 'Which payment methods are accepted?' },
    answer: {
      es: 'Aceptamos tarjetas internacionales Visa, Mastercard, American Express y PIX; débito Visa Electron y Maestro; y efectivo en USD, ARS o BRL.',
      pt: 'Aceitamos cartões internacionais Visa, Mastercard e American Express, PIX, débito Visa Electron e Maestro e dinheiro em USD, ARS ou BRL.',
      en: 'We accept international Visa, Mastercard and American Express cards, PIX, Visa Electron and Maestro debit cards, and cash in USD, ARS or BRL.',
    },
    keywords: { es: ['pago', 'tarjeta', 'efectivo', 'pix', 'moneda'], pt: ['pagamento', 'cartao', 'dinheiro', 'pix', 'moeda'], en: ['payment', 'card', 'cash', 'pix', 'currency'] },
  },
  {
    id: 'exchanges',
    question: { es: '¿Realizan cambios de productos?', pt: 'É possível trocar produtos?', en: 'Can products be exchanged?' },
    answer: {
      es: 'Se cambia o sustituye un producto por fallas o defectos de fabricación si no fue utilizado, está en perfectas condiciones, conserva su embalaje original y se presenta el ticket original. Consultá el plazo en tienda o escribí a info@dfspi.com.',
      pt: 'Produtos com falha ou defeito de fabricação podem ser trocados se não tiverem sido usados, estiverem em perfeitas condições, com a embalagem original e o comprovante de compra. Consulte o prazo na loja ou escreva para info@dfspi.com.',
      en: 'Products with manufacturing faults or defects may be exchanged if unused, in perfect condition, in their original packaging and accompanied by the original receipt. Ask about the applicable period in store or email info@dfspi.com.',
    },
    keywords: { es: ['cambio', 'devolucion', 'defecto', 'ticket'], pt: ['troca', 'devolucao', 'defeito', 'comprovante'], en: ['exchange', 'return', 'defect', 'receipt'] },
  },
  {
    id: 'transport',
    question: { es: '¿Ofrecen traslados?', pt: 'Vocês oferecem transporte?', en: 'Do you provide transportation?' },
    answer: {
      es: 'No contamos con micros propios. Sugerimos consultar agencias o servicios de transporte local, o pedir recomendaciones en la recepción de tu hotel.',
      pt: 'Não contamos com ônibus próprios. Sugerimos consultar agências ou serviços de transporte local ou pedir recomendações na recepção do hotel.',
      en: 'We do not operate our own shuttle buses. We suggest contacting a local transport service or asking your hotel reception for recommendations.',
    },
    keywords: { es: ['traslado', 'micro', 'transporte', 'hotel'], pt: ['transporte', 'onibus', 'hotel'], en: ['transport', 'shuttle', 'bus', 'hotel'] },
  },
  {
    id: 'promotions',
    question: { es: '¿Las promociones se mantienen con cualquier medio de pago?', pt: 'As promoções valem para qualquer forma de pagamento?', en: 'Do promotions apply to every payment method?' },
    answer: {
      es: 'Sí, excepto cuando la promoción esté vinculada a un medio de pago o entidad bancaria específica, o cuando sus bases y condiciones indiquen lo contrario.',
      pt: 'Sim, exceto quando a promoção estiver vinculada a uma forma de pagamento ou banco específico, ou quando os termos e condições indicarem o contrário.',
      en: 'Yes, unless the promotion is tied to a specific payment method or bank, or its terms and conditions state otherwise.',
    },
    keywords: { es: ['promocion', 'descuento', 'banco', 'medio de pago'], pt: ['promocao', 'desconto', 'banco', 'pagamento'], en: ['promotion', 'discount', 'bank', 'payment method'] },
  },
  {
    id: 'accessibility',
    question: { es: '¿Es accesible el Duty Free Shop Puerto Iguazú?', pt: 'O Duty Free Shop Puerto Iguazú é acessível?', en: 'Is Duty Free Shop Puerto Iguazú accessible?' },
    answer: {
      es: 'Sí. Contamos con estacionamiento reservado, ascensores, rampas mecánicas, ingreso de perros guía, probadores y sanitarios adaptados, mesas accesibles en el bar, menú en Braille, cajas preferenciales y sectores preparados para movilidad reducida.',
      pt: 'Sim. Há vagas reservadas, elevadores, rampas rolantes, acesso para cães-guia, provadores e banheiros adaptados, mesas acessíveis no bar, cardápio em Braille, caixas preferenciais e áreas preparadas para mobilidade reduzida.',
      en: 'Yes. The store has reserved parking spaces, lifts, moving ramps, guide-dog access, adapted fitting rooms and restrooms, accessible bar tables, a Braille menu, priority checkouts and areas designed for reduced mobility.',
    },
    keywords: { es: ['accesible', 'discapacidad', 'silla', 'rampa', 'braille', 'perro guia'], pt: ['acessivel', 'deficiencia', 'cadeira', 'rampa', 'braille', 'cao guia'], en: ['accessible', 'disability', 'wheelchair', 'ramp', 'braille', 'guide dog'] },
  },
  {
    id: 'prices',
    question: { es: '¿Dónde puedo consultar los precios?', pt: 'Onde posso consultar os preços?', en: 'Where can I check product prices?' },
    answer: {
      es: 'Por política interna no publicamos precios de productos en línea. Podés consultarnos por email o teléfono, o verificarlos directamente en la tienda.',
      pt: 'Por política interna, não publicamos preços de produtos online. Consulte por email ou telefone, ou verifique diretamente na loja.',
      en: 'Company policy does not allow product prices to be published online. You may contact us by email or phone, or check prices directly in store.',
    },
    keywords: { es: ['precio', 'valor', 'cuanto', 'usd', 'dolar'], pt: ['preco', 'valor', 'quanto', 'usd', 'dolar'], en: ['price', 'cost', 'usd', 'dollar'] },
  },
  {
    id: 'parking',
    question: { es: '¿Tienen estacionamiento?', pt: 'Há estacionamento?', en: 'Is parking available?' },
    answer: {
      es: 'Sí. Hay estacionamiento techado gratuito para 450 vehículos y un espacio exterior gratuito para otros 500.',
      pt: 'Sim. Há estacionamento coberto gratuito para 450 veículos e uma área externa gratuita para mais 500.',
      en: 'Yes. Free covered parking is available for 450 vehicles, plus a free outdoor area for another 500 vehicles.',
    },
    keywords: { es: ['estacionamiento', 'parking', 'auto', 'vehiculo'], pt: ['estacionamento', 'carro', 'veiculo'], en: ['parking', 'car', 'vehicle'] },
  },
  {
    id: 'online-reservations',
    question: { es: '¿Disponen de reservas online?', pt: 'Há uma plataforma de reservas online?', en: 'Is online product reservation available?' },
    answer: { es: 'Por el momento no contamos con un sistema de reservas online.', pt: 'No momento, não contamos com um sistema de reservas online.', en: 'Online product reservation is not currently available.' },
    keywords: { es: ['reserva', 'reservar', 'online'], pt: ['reserva', 'reservar', 'online'], en: ['reservation', 'reserve', 'online'] },
  },
  {
    id: 'purchase-limits',
    question: { es: '¿Hay algún límite de compra?', pt: 'Existe limite de compra?', en: 'Is there a purchase limit?' },
    answer: {
      es: 'La tienda no fija un límite mientras no se presuma fin comercial. La franquicia de ingreso y sus límites dependen del país de destino. Para ingresar al predio debés registrar tu salida en la aduana del país de procedencia y contar con la documentación requerida.',
      pt: 'A loja não estabelece limite desde que não haja finalidade comercial. A franquia e seus limites dependem do país de destino. Para entrar no estabelecimento, registre sua saída na aduana do país de origem e tenha a documentação exigida.',
      en: 'The store does not impose a limit provided the purchase is not presumed to be for commercial purposes. Customs allowances depend on the destination country. To enter the premises, register your departure with the customs authority of your country of origin and carry the required documents.',
    },
    keywords: { es: ['limite', 'franquicia', 'aduana', 'documentacion'], pt: ['limite', 'franquia', 'aduana', 'documentacao'], en: ['limit', 'allowance', 'customs', 'documents'] },
  },
  {
    id: 'exchange-rate',
    question: { es: '¿Cómo puedo conocer la cotización del dólar?', pt: 'Como posso consultar a cotação do dólar?', en: 'How can I check the current exchange rate?' },
    answer: {
      es: 'La cotización vigente de dólar a peso argentino y de dólar a real se informa en la cartelería ubicada en el ingreso de la tienda.',
      pt: 'As cotações do dólar para peso argentino e do dólar para real são informadas nos painéis da entrada da loja.',
      en: 'Current USD-to-ARS and USD-to-BRL exchange rates are displayed on signs at the store entrance.',
    },
    keywords: { es: ['cotizacion', 'cambio', 'dolar', 'real', 'peso'], pt: ['cotacao', 'cambio', 'dolar', 'real', 'peso'], en: ['exchange rate', 'currency', 'dollar', 'real', 'peso'] },
  },
]
