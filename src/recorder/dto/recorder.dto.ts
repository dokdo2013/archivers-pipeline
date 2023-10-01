import { ApiProperty } from '@nestjs/swagger';

export class RecorderDto {
  @ApiProperty({
    description: 'user_id',
    example: 'arahashitabi_stellive',
  })
  user_id: string;
}
