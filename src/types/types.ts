// types.ts (or you can include this directly in the component file)
export interface Schedule {
  _id: number;
  customerName: string;
  dispatchDate: string; // You can change this to Date if you prefer Date objects
  deliveryDate: string; // Same as above for Date objects
  email:string;
  status: ScheduleStatus;
  notes:string;
  phone:string
}

export interface ScheduleStats {
  total: number;
  active: number;
  completed: number;
}
export enum ScheduleStatus {
  ACTIVE = 'Active',
  COMPLETED = 'Completed',
  CANCELED='Canceled'
}