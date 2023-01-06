const Realm = require('realm');
export const MEDICINE_INFO = 'medicineInfo';
export const DOSE_INFO = 'doseInfo';
export const DOSE_STATUS = 'doseStatus';
export const  HYDRATION_INFO="hydrationInfo"
export const  HYDRATION_STATUS="Hydrationstatus"
export const HYDRATION_CUPS="HydrationCups"
export const hydrationInfo = {
  name: HYDRATION_INFO,
  properties: {
    Id: { type: 'int', default: 1 },
    UserId: { type: 'int', default: 1 },
   Weight: 'string',
    Wakeup: { type: 'date', optional: true, default: null },
    Bedtime: { type: 'date', optional: true, default: null },
    Enddate: { type: 'date', optional: true, default: null },  },
};
export const HydrationStatus = {
  name: HYDRATION_STATUS,
  properties: {
    Id: { type: 'int', default: 1 },
    TakenTime: 'string',
    
  },
};
export const HydrationCups = {
  name: HYDRATION_CUPS,
  properties: {
    Id: { type: 'int', default: 1 },
    qty: 'string',
    
  },
};
export const medicineInfo = {
  name: MEDICINE_INFO,
  properties: {
    Id: { type: 'int', default: 1 },
    UserId: { type: 'int', default: 1 },
    Tabletname: 'string',
    Reason: 'string',
    Startdate: 'date',
    Enddate: { type: 'date', optional: true, default: null },
    Doseinfo: { type: 'list', objectType: DOSE_INFO },
    Dosestatus: { type: 'list', objectType: DOSE_STATUS },
  },
};

export const doseInfo = {
  name: DOSE_INFO,
  properties: {
    Id: { type: 'int', default: 1 },
    MedicationId: { type: 'int', default: 1 },
    Dosetime: 'string',
    Time: 'string',
    WhenToTake: 'string',
    Quantity: 'string',
    Strength: 'string',
  },
};

export const doseStatus = {
  name: DOSE_STATUS,
  properties: {
    Id: { type: 'int', default: 1 },
    MedicationId: { type: 'int', default: 1 },
    MedDoseId: { type: 'int', default: 1 },
    TakenTime: 'string',
    TakenDate: 'string',
    SkipReason: 'string',
    IsTaken: 'string',
  },
};

export const realm=new Realm({schema:[hydrationInfo,HydrationCups,HydrationStatus,medicineInfo,doseInfo,doseStatus]});

