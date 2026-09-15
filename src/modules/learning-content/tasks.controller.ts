import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { Role } from '../../common/constants/roles.js';
import { TasksService } from './tasks.service.js';
import {
  CreateTaskDto,
  TaskResponseDto,
  UpdateTaskDto,
} from './dto/learning-content.dto.js';

@ApiTags('tasks')
@ApiBearerAuth()
@Controller({ path: 'tasks', version: '1' })
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @ApiOperation({ summary: 'Erstellt eine Praxisaufgabe (Entwurf)' })
  @ApiResponse({ status: 201, type: TaskResponseDto })
  @Roles(Role.admin, Role.ausbilder)
  @Post()
  create(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listet Aufgaben (Azubis nur freigegebene)' })
  @ApiResponse({ status: 200, type: [TaskResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<TaskResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert eine Aufgabe' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<TaskResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Bearbeitet eine Aufgabe (Entwurf)' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  @Roles(Role.admin, Role.ausbilder)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<TaskResponseDto> {
    return this.service.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Gibt eine Aufgabe für Azubis frei' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  @Roles(Role.ausbilder, Role.admin)
  @Post(':id/release')
  release(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<TaskResponseDto> {
    return this.service.release(id, user);
  }

  @ApiOperation({ summary: 'Zieht die Freigabe einer Aufgabe zurück' })
  @ApiResponse({ status: 200, type: TaskResponseDto })
  @Roles(Role.ausbilder, Role.admin)
  @Post(':id/unrelease')
  unrelease(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<TaskResponseDto> {
    return this.service.unrelease(id, user);
  }

  @ApiOperation({ summary: 'Löscht eine Aufgabe' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.admin, Role.ausbilder)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
