export interface FormData {
  senderName: string;
  senderPhone: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  recipientStreet: string;
  recipientCity: string;
  recipientLandmark: string;
  recipientNotes: string;
  foodWeight: string;
  nonFoodWeight: string;
  hn7Weight: string;
  length: string;
  width: string;
  height: string;
  packageType: string;
  packaging: string;
  specialHandling: string[];
  comments: string;
  additionalFeesAmount: string;
  additionalFeesCurrency: 'EUR' | 'XOF';
  advanceAmount: string;
  advanceCurrency: 'EUR' | 'XOF';
}

export interface ValidationErrors {
  [key: string]: string;
}