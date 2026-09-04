import { IsEnum, IsUUID } from 'class-validator';
import { SwipeAction } from '../swipe-action.enum.js';

export class CreateSwipeDto {
  @IsUUID()
  swipedId: string;

  @IsEnum(SwipeAction)
  action: SwipeAction;
}
