export interface Participant {
  id: string;
  name: string;
  avatarIndex: number;
  customPhotoUri?: string;
}

export interface Assignment {
  giver: Participant;
  receiver: Participant;
}

export interface EditModal {
  visible: boolean;
  id?: string;
  name?: string;
  avatarIndex?: number;
  customPhotoUri?: string;
}

export type ScreenType = 'home' | 'results';

export interface AppState {
  participants: Participant[];
  assignments: Assignment[];
  budget: string;
  currentScreen: ScreenType;
  isDrawing: boolean;
  showConfetti: boolean;
}