export type Locale = 'es' | 'pt' | 'en'
export type Category = 'perfumes' | 'bebidas' | 'delicatessen' | 'tecnologia'
export interface Product { id:string; brand:string; name:string; subtitle:Record<Locale,string>; category:Category; image:string; price:number; originalPrice?:number; stock:number; featured?:boolean; volume?:string; description:Record<Locale,string> }
export interface CartItem { productId:string; quantity:number }
export type ReservationStatus = 'confirmada'|'lista_para_retirar'|'retirada'|'cancelada'|'vencida'
export interface Reservation { id?:string; code:string; customer:{name:string;email:string;phone:string}; pickupDate:string; expiresAt:string; createdAt:string; status:ReservationStatus; items:CartItem[]; locale:Locale; total:number }
export interface AdminSession { email:string; role:string }
export interface Faq { id:string; question:Record<Locale,string>; answer:Record<Locale,string>; keywords:Record<Locale,string[]> }
