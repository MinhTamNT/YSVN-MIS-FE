export interface Task {
  JobTitle: string;
  StartTime: Date;
  EndTime: Date;
  Priority: number;
  Content: string;
  WithPerson: string;
  TransportationMode: string;
  NextAppointment: Date;
  Referral: string;
  Cost: string;
  Notes: string;
  AttachmentURL: string | null;
  Status: number;
}
