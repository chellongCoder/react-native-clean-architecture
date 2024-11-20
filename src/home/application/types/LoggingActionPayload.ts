export interface LoggingActionPayload {
  key: string;
  value: Record<string, any>;
  userId?: string;
  action: ActionE;
}

export enum ActionE {
  CLICK_BUTTON,
  VIEW_DATA,
  GOTO_PAGE,
}
