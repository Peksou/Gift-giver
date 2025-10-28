export interface Participant {
  id: string;
  name: string;
  avatarIndex: number;
}

export interface Assignment {
  giver: Participant;
  receiver: Participant;
}

export interface EditModal {
  visible: boolean;
  id?: string;
  name?: string;
}

export type ScreenType = 'home' | 'results';

export interface AppState {
  participants: Participant[];
  assignments: Assignment[];
  sessionCode: string;
  budget: string;
  currentScreen: ScreenType;
  isDrawing: boolean;
  showConfetti: boolean;
}