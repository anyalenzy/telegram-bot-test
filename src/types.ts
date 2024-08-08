import { Context, Scenes } from "telegraf";
export type UserContactInfo = {
  name: string;
  phone: string;
  address: string;
};

export interface UserData {
  id: number;
  username?: string;
  objectType?: string;
  area?: string;
  location?: string;
  district?: string;
  works?: string[];
  // editingField?: string;
  contactInfo?: UserContactInfo;
}

interface MySession extends Scenes.SceneSession {
  userData: UserData;
}
export interface MyContext extends Context {
  session: MySession;
  scene: Scenes.SceneContextScene<MyContext>;
}
