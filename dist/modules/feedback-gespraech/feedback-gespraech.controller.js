var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { FeedbackGespraechService } from './feedback-gespraech.service.js';
import { CreateFeedbackGespraechDto, UpdateFeedbackGespraechDto, CreateVereinbarungDto } from './dto/feedback-gespraech.dto.js';
let FeedbackGespraechController = class FeedbackGespraechController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    create(u, dto) { return this.svc.create(u, dto); }
    findAll(u) { return this.svc.findAll(u); }
    findOne(u, id) { return this.svc.findOne(id, u); }
    update(u, id, dto) { return this.svc.update(id, u, dto); }
    addVereinbarung(u, id, dto) { return this.svc.addVereinbarung(id, u, dto); }
    complete(u, id, vid) { return this.svc.completeVereinbarung(id, vid, u); }
};
__decorate([
    Post(),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateFeedbackGespraechDto]),
    __metadata("design:returntype", void 0)
], FeedbackGespraechController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FeedbackGespraechController.prototype, "findAll", null);
__decorate([
    Get(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], FeedbackGespraechController.prototype, "findOne", null);
__decorate([
    Patch(':id'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UpdateFeedbackGespraechDto]),
    __metadata("design:returntype", void 0)
], FeedbackGespraechController.prototype, "update", null);
__decorate([
    Post(':id/vereinbarungen'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CreateVereinbarungDto]),
    __metadata("design:returntype", void 0)
], FeedbackGespraechController.prototype, "addVereinbarung", null);
__decorate([
    Patch(':id/vereinbarungen/:vid/erledigt'),
    __param(0, CurrentUser()),
    __param(1, Param('id')),
    __param(2, Param('vid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], FeedbackGespraechController.prototype, "complete", null);
FeedbackGespraechController = __decorate([
    ApiTags('feedback-gespraeche'),
    ApiBearerAuth(),
    Controller({ path: 'feedback-gespraeche', version: '1' }),
    __metadata("design:paramtypes", [FeedbackGespraechService])
], FeedbackGespraechController);
export { FeedbackGespraechController };
//# sourceMappingURL=feedback-gespraech.controller.js.map