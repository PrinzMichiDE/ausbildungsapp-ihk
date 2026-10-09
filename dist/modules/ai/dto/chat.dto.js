var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class ChatMessageDto {
    role;
    content;
}
__decorate([
    ApiProperty({
        description: 'Message role: user, assistant, or system',
        enum: ['user', 'assistant', 'system'],
        example: 'user',
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "role", void 0);
__decorate([
    ApiProperty({
        description: 'Message content text',
        example: 'How do I schedule a new training course?',
    }),
    IsNotEmpty(),
    IsString(),
    __metadata("design:type", String)
], ChatMessageDto.prototype, "content", void 0);
export class ChatDto {
    messages;
}
__decorate([
    ApiProperty({
        description: 'Array of chat messages in conversation order',
        type: [ChatMessageDto],
        example: [
            { role: 'user', content: 'How do I schedule a new training course?' },
        ],
    }),
    IsNotEmpty(),
    Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch {
                return value;
            }
        }
        return value;
    }),
    __metadata("design:type", Array)
], ChatDto.prototype, "messages", void 0);
//# sourceMappingURL=chat.dto.js.map