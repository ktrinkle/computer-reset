export interface ClaimPrincipal {
    access_token: string;
    expires_on: string;
    provider_name: string;
    user_claims?: (UserClaimsEntity)[] | null;
    user_id: string;
  }
  export interface UserClaimsEntity {
    typ: string;
    val: string;
  }

  export interface UserModel {
    id: number;
    firstName: string;
    lastName: string;
    cityName: string;
    stateCode: string;
    realName: string;
    facebookId: string;
    adminFlag: boolean;
    volunteerFlag: boolean;
  }

  export interface Timeslot {
    id: number;
    eventStartTms: Date;
    eventEndTms: Date;
    eventSlotCnt: number;
    eventOpenTms: Date;
    eventClosed: boolean;
    overbookCnt: number;
    signupCnt: number;
    eventNote: string;
    privateEventInd: boolean;
    intlEventInd: boolean;
    facebookId?: string;
  }

  export interface TimeslotSmall {
    id: number;
    eventStartTms: Date;
    eventEndTms: Date;
    userSlot: string;
    eventClosed: boolean;
    eventNote: string;
    intlEventInd: boolean;
  }

  export interface Signup {
    fbId: string;
    eventId: number;
    cityNm: string;
    stateCd: string;
    realname: string;
    firstNm: string;
    lastNm: string;   
  }

  export interface StateList {
    id: number;
    stateCode: string;
    stateName: string;
    usCities: string[];
  }

  export interface CityList {
    id: number;
    idState: number;
    city: string;
    county: string;
    latitude: number;
    longitude: number;
    idStateNavigation: string;
  }

  export interface ApiUser {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    token?: string;
  }

  export interface UserRetrieve {
    cityNm: string;
    stateCd: string;
    realNm: string;
    adminFlag: boolean;
    volunteerFlag: boolean;
  }

  export interface UserSmall {
    firstName: string;
    lastName: string;
    facebookId: string;
  }

  export interface UserEventSignup {
    id: number;
    userid: number;
    firstNm: string;
    lastNm: string;   
    realNm: string;
    cityNm: string;
    stateCd: string;
    timeslotId: number;
    signupTms: Date;
    attendNbr: number;
    eventCnt: number;
    banFlag: boolean;
    signupTxt: string;
    confirmInd: boolean;
    noShowCnt: number;
  }

  export interface UserEventNote {
    id: number;
    signupTxt: string;
    fbId: string;
  }
  
  export interface UserEventDayOf {
    id: number;
    userid: number;
    firstNm: string;
    lastNm: string;   
    realNm: string;
    timeslotId: number;
    attendInd: boolean;
    attendNbr: number;
    banFlag: boolean;
    cityNm: string;
    stateCd: string;
    confirmInd: boolean;
    noShowInd: boolean;
  }

  export interface Standby {
    id: number;
    firstNm: string;
    lastNm: string;   
    realNm: string;
    cityNm: string;
    stateCd: string;
    metroplexInd: boolean;
    timeslotId: number;
    eventStartTms: Date;
    signupTms: Date;
    noShowCnt: number;
    eventCnt: number;
    signupTxt: number;
  }

  export interface Slot {
    id: number;
    eventDate: Date;
    eventSlotCnt: number;
    AvailSlot: number;
  }

  export interface standbyList {
    slot: Slot[];
    standbys: Standby[];
  }

  export interface UserManual {
    id: number;
    firstNm: string;
    lastNm: string;
    cityNm: string;
    stateCd: string;
    realNm: string;
    fbId: string;
    banFlag: boolean;
    adminFlag: boolean;
    volunteerFlag: boolean;
    facebookId: string;
  }