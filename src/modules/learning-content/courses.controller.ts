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
import { CoursesService } from './courses.service.js';
import {
  CourseResponseDto,
  CreateCourseDto,
  UpdateCourseDto,
} from './dto/learning-content.dto.js';

@ApiTags('courses')
@ApiBearerAuth()
@Controller({ path: 'courses', version: '1' })
export class CoursesController {
  constructor(private readonly service: CoursesService) {}

  @ApiOperation({ summary: 'Erstellt einen Kurs (Entwurf)' })
  @ApiResponse({ status: 201, type: CourseResponseDto })
  @Roles(Role.admin, Role.ausbilder)
  @Post()
  create(@Body() dto: CreateCourseDto): Promise<CourseResponseDto> {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listet Kurse (Azubis nur freigegebene)' })
  @ApiResponse({ status: 200, type: [CourseResponseDto] })
  @Get()
  findAll(@CurrentUser() user: CurrentUser): Promise<CourseResponseDto[]> {
    return this.service.findAll(user);
  }

  @ApiOperation({ summary: 'Liefert einen Kurs' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<CourseResponseDto> {
    return this.service.findOne(id, user);
  }

  @ApiOperation({ summary: 'Bearbeitet einen Kurs (Entwurf)' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @Roles(Role.admin, Role.ausbilder)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @CurrentUser() user: CurrentUser,
  ): Promise<CourseResponseDto> {
    return this.service.update(id, dto, user);
  }

  @ApiOperation({ summary: 'Gibt einen Kurs für Azubis frei' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @Roles(Role.ausbilder, Role.admin)
  @Post(':id/release')
  release(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<CourseResponseDto> {
    return this.service.release(id, user);
  }

  @ApiOperation({ summary: 'Zieht die Freigabe eines Kurses zurück' })
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @Roles(Role.ausbilder, Role.admin)
  @Post(':id/unrelease')
  unrelease(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUser,
  ): Promise<CourseResponseDto> {
    return this.service.unrelease(id, user);
  }

  @ApiOperation({ summary: 'Löscht einen Kurs' })
  @ApiResponse({ status: 204, description: 'Gelöscht' })
  @Roles(Role.admin, Role.ausbilder)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.service.remove(id);
  }
}
