export interface Task {
  AutoID?: number;
  JobTitle: string;
  StartTime: Date;
  EndTime: Date;
  Priority: number;
  Content: string;
  WithPerson: string;
  TransportationMode: number;
  NextAppointment: Date;
  Referral: string;
  Cost: string;
  Notes: string;
  AttachmentURL: string | null;
  Status: number;
}
