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
    facebookId: number;
    adminFlag: boolean;
    volunteerFlag: boolean;
  }

  export interface UserSmall {
    facebookId: number;
    firstName: string;
    lastName: string;
  }

  export interface Timeslot {
    Id: number;
    eventStartTms: Date;
    eventEndTms: Date;
    eventSlotCnt: number;
    eventOpenTms: Date;
    eventClosed: boolean;
    overbookCnt: number;
  }

  export interface Signup {
    userId: number,
    eventId: number,
    cityNm: string,
    stateCd: string,
    realname: string
  }

