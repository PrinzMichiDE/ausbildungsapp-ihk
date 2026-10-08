import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ChatMessageDto {
  @ApiProperty({
    description: 'Message role: user, assistant, or system',
    enum: ['user', 'assistant', 'system'],
    example: 'user',
  })
  @IsNotEmpty()
  @IsString()
  role: 'user' | 'assistant' | 'system';

  @ApiProperty({
    description: 'Message content text',
    example: 'How do I schedule a new training course?',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class ChatDto {
  @ApiProperty({
    description: 'Array of chat messages in conversation order',
    type: [ChatMessageDto],
    example: [
      { role: 'user', content: 'How do I schedule a new training course?' },
    ],
  })
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  messages: ChatMessageDto[];
}